
'use strict';

// Modules
let path                           = require('path');
let fs                             = require('fs');
let build_nested_pages             = require('../functions/build_nested_pages.js');
let marked                         = require('marked');
let toc                            = require('markdown-toc');
let remove_image_content_directory = require('../functions/remove_image_content_directory.js');

const contentProcessors = require('../functions/contentProcessors');
const contentsHandler = require('../core/contents');
const utils = require('../core/utils');

function route_wildcard (config, reffilePaths) {
  return function (req, res, next) {
    // Skip if nothing matched the wildcard Regex
    if (!req.params[0]) { return next(); }

    let suffix = 'edit';
    let slug   = req.params[0];
    let originalFilePaths = reffilePaths["original"]
    let filePaths = reffilePaths["modified"]
    let nestedPages = reffilePaths["nestedPages"]
    let pathIndex = filePaths.findIndex(function(elem){return elem === slug})
    slug = originalFilePaths[pathIndex]
    let navSlugs = {}
    if(pathIndex === 0) navSlugs = {next:filePaths[pathIndex+1]}
    else {
      if(pathIndex === reffilePaths.length - 1)navSlugs = {prev:filePaths[pathIndex-1]}
      else navSlugs = {prev:filePaths[pathIndex-1], next:filePaths[pathIndex+1]}
    }
    
    let file_path      = path.normalize(config.content_dir + slug);
    file_path = file_path.replace(/\/00\./g, '/')
    let file_path_orig = file_path;

    if (file_path.indexOf(suffix, file_path.length - suffix.length) !== -1) {
      file_path = file_path.slice(0, -suffix.length - 1);
    }

    fs.readFile(file_path, 'utf8', function (error, content) {

      if (error) {
        error.status = '404';
        error.message = config.lang.error['404'];
        return next(error);
      }
      if (path.extname(file_path) === '.md') {
        let meta = contentProcessors.processMeta(content);
        meta.custom_title = meta.title;
        if (!meta.title) { meta.title = contentProcessors.slugToTitle(file_path); }
        // Content
        content = contentProcessors.stripMeta(content);
        content = contentProcessors.processVars(content, config);

        let template = meta.template || 'page';
        let render   = template;
        if (file_path_orig.indexOf(suffix, file_path_orig.length - suffix.length) !== -1) {

          // Edit Page
          if ((config.authentication || config.authentication_for_edit) && !req.session.loggedIn) {
            res.redirect('/login');
            return;
          }
          render  = 'edit';

        } else {

          // Render Table of Contents
          if (config.table_of_contents) {
            let tableOfContents = toc(content);
            if (tableOfContents.content) {
              content = '#### Table of Contents\n' + tableOfContents.content + '\n\n' + content;
            }
          }

          // Render Markdown
          marked.setOptions({
            langPrefix : ''
          });
          content = marked(content);

        }
        // let pageList = remove_image_content_directory(config, contentsHandler(slug, config));
        let pageList = nestedPages

        let loggedIn = ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false);

        let canEdit = false;
        if (config.authentication || config.authentication_for_edit) {
          canEdit = loggedIn && config.allow_editing;
        } else {
          canEdit = config.allow_editing;
        }

        slug = reffilePaths.modified[pathIndex]
        const removeParent = (pages) => {
          let modified = false;
          for(let i in pages) {
            pages[i].parent = false
            if(pages[i].files)
              pages[i].files = removeParent(pages[i].files)
          }
          return pages
        }

        const getTitle = (slug, pages) => {
          let title ;
          for(let i in pages) {
            if(pages[i].slug === slug) {
              return pages[i].title
            }
          }
          for(let i in pages) {
            if(pages[i].files) {
              let tmp = getTitle(slug, pages[i].files)
              if(tmp) title = tmp
            }
          }
          return title
        }

        const createBreadCrumbs = (slug, pages) => {
          let breadCrumbTitles = []
          let breadCrumbSlugs = []
          let parts = slug.split('/')
          parts = parts.slice(1)
          for(let i in parts) {
            let tmpParts = [... parts];
            tmpParts = tmpParts.reverse().slice(tmpParts.length-i-1)
            tmpParts.reverse();
            tmpParts = '/' + tmpParts.join('/')
            let tmpSlug = tmpParts
            let title = getTitle(tmpSlug, pages)
            breadCrumbTitles.push(title)
            breadCrumbSlugs.push(tmpSlug)
          }
          breadCrumbTitles.reverse()
          breadCrumbSlugs.reverse()
          const addtoRets = (rets, linetoAdd, tmpSlug, isEnd) => {
            if(Object.keys(rets).length === 0) return {title: linetoAdd, slug: tmpSlug, isEnd}
            return {
              title: linetoAdd,
              breadCrumbs: rets,
              slug: tmpSlug,
              isEnd
            }
          }
          let ret = {}
          for(let i in breadCrumbTitles) {
            let isEnd = (parseInt(i) === 0)? true: false;
            ret = addtoRets(ret, breadCrumbTitles[i], breadCrumbSlugs[i], isEnd)
          }
          return ret;
        }
        const getActive = (pages, slug, allpages) => {
          let modified = false;
          let breadCrumbs;
          for(let i in pages) {
            if(pages[i].slug === slug) {
              pages[i].active = true
              breadCrumbs=  createBreadCrumbs(pages[i].slug, allpages)
              modified = true;
            } else {
              pages[i].active = false
            }
            if(pages[i].files) {
              let tmp = getActive(pages[i].files, slug, allpages)
              let retpages = tmp.retpages
              let retmodified = tmp.retmodified
              
              
              if(retmodified === true) {
                pages[i].parent = true;
                breadCrumbs = tmp.breadCrumbs
                modified = true;
              }
              pages[i].files = retpages
            }
              
          }
          return {retpages:pages, retmodified: modified, breadCrumbs}
        }
      
        let retpageList = removeParent([...pageList])
        retpageList = getActive([...retpageList], slug, [...retpageList])
        let breadCrumbs = retpageList.breadCrumbs
        retpageList = retpageList.retpages
        return res.render(render, {
          config        : config,
          pages         : retpageList,
          meta          : meta,
          content       : content,
          body_class    : template + '-' + contentProcessors.cleanString(slug),
          last_modified : utils.getLastModified(config, meta, file_path),
          lang          : config.lang,
          loggedIn      : loggedIn,
          username      : (config.authentication ? req.session.username : null),
          canEdit       : canEdit,
          navSlugs,
          breadCrumbs
        });
      }

    });

  };
}

// Exports
module.exports = route_wildcard;