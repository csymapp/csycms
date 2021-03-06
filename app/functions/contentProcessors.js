
'use strict';

const path = require('path');
const fs   = require('fs');
const _s   = require('underscore.string');
const yaml = require('js-yaml');

// Regex for page meta (considers Byte Order Mark \uFEFF in case there's one)
// Look for the the following header formats at the beginning of the file:
// /*
// {header string}
// */
//   or
// ---
// {header string}
// ---
const _metaRegex = /^\uFEFF?\/\*([\s\S]*?)\*\//i;
const _metaRegexYaml = /^\uFEFF?---([\s\S]*?)---/i;

function cleanString (str, use_underscore) {
  const u = use_underscore || false;
  str = str.replace(/\//g, ' ').trim();
  if (u) {
    return _s.underscored(str);
  } else {
    return _s.trim(_s.dasherize(str), '-');
  }
}

// Clean object strings.
function cleanObjectStrings (obj) {
  let cleanObj = {};
  for (let field in obj) {
    if(typeof obj[field] === 'object') {
      cleanObj[cleanString(field, true)] = cleanObjectStrings(obj[field])
    }else {
      if (obj.hasOwnProperty(field)) {
        cleanObj[cleanString(field, true)] = ('' + obj[field]).trim();
      }
    }
  }
  return cleanObj;
}

// Convert a slug to a title
function slugToTitle (slug) {
  slug = slug.replace('.md', '').trim();
  return _s.titleize(_s.humanize(path.basename(slug)));
}

// Strip meta from Markdown content
function stripMeta (markdownContent) {
  switch (true) {
    case _metaRegex.test(markdownContent):
      return markdownContent.replace(_metaRegex, '').trim();
    case _metaRegexYaml.test(markdownContent):
      return markdownContent.replace(_metaRegexYaml, '').trim();
    default:
      return markdownContent.trim();
  }
}

// Get meta information from Markdown content
function processMeta (markdownContent) {
  let meta = {};
  let metaArr;
  let metaString;
  let metas;

  let yamlObject;

  switch (true) {
    case _metaRegex.test(markdownContent):
      metaArr = markdownContent.match(_metaRegex);
      metaString = metaArr ? metaArr[1].trim() : '';

      if (metaString) {
        metas = metaString.match(/(.*): (.*)/ig);
        metas.forEach(item => {
          const parts = item.split(': ');
          console.log(parts)
          if (parts[0] && parts[1]) {
            meta[cleanString(parts[0], true)] = parts[1].trim();
          }
        });
      }
      break;

    case _metaRegexYaml.test(markdownContent):
      metaArr = markdownContent.match(_metaRegexYaml);
      metaString = metaArr ? metaArr[1].trim() : '';
      yamlObject = yaml.safeLoad(metaString);
      meta = cleanObjectStrings(yamlObject);
      break;

    default:
    // No meta information
  }

  // console.log(meta)

  return meta;
}

// Replace content variables in Markdown content
function processVars (markdownContent, config) {
  if (config.variables && Array.isArray(config.variables)) {
    config.variables.forEach((v) => {
      markdownContent = markdownContent.replace(new RegExp('%' + v.name + '%', 'g'), v.content);
    });
  }
  if (config.base_url) {
    markdownContent = markdownContent.replace(/%base_url%/g, config.base_url);
  }
  if (config.image_url) {
    markdownContent = markdownContent.replace(/%image_url%/g, config.image_url);
  }
  // public_url
  markdownContent = markdownContent.replace(/%public_url%/g,`${config.base_url}/sites/${config.site}`);

  return markdownContent;
}

function extractDocument (contentDir, filePath, debug, domain=null) {
  try {
    const file = fs.readFileSync(filePath);
    const meta = processMeta(file.toString('utf-8'));

    const id    = filePath.replace(contentDir, '').trim();
    const title = meta.title ? meta.title : slugToTitle(id);
    const body  = file.toString('utf-8');

    let ret = { id, title, body }

    if(domain)ret['domain'] = domain
    return ret
  } catch (e) {
    if (debug) {
      console.log(e);
    }
    return null;
  }
}

exports.default = {
  cleanString,
  cleanObjectStrings,
  extractDocument,
  slugToTitle,
  stripMeta,
  processMeta,
  processVars
};
module.exports = exports.default;
