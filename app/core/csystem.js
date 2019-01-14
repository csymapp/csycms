'use strict'

const fse           = require('fs-extra')
, path              = require('path')
, _                 = require('underscore')
, contentProcessors = require('../functions/contentProcessors')

class Csystem
{
	constructor()
	{
		
    }

    listFiles (dir) {
        let self = this
        return fse.readdirSync(dir).reduce(function (list, file) {
          var name = path.join(dir, file);
          var isDir = fse.statSync(name).isDirectory();
          return list.concat(isDir ? self.listFiles(name) : [name]);
        }, []);
    }
    
    build_nested_pages(originalPageList, refPageList, content_dir) {
        let nestedPages = [];
        let pageParts = []
        , metas = []
        , self = this    
    
        
        for(let i in originalPageList) {
            let filePath = path.join(content_dir, originalPageList[i])
            filePath = filePath.replace('00.chapter.md', 'chapter.md')
            const file = fse.readFileSync(filePath);

            const meta = contentProcessors.processMeta(file.toString('utf-8'));
            metas[i] = meta
        }

        let {pageListWithTitle} = originalPageList.reduce((accumulator, currentValue, currentIndex, originalPageListArray) => {
                accumulator.pageListWithTitle.push({path:currentValue , index: currentIndex, slug: refPageList[currentIndex], title: metas[currentIndex].title})
                return accumulator
        }, {pageListWithTitle:[] })

        nestedPages = self.build_nested_pages_inner(pageListWithTitle, 0)
        return nestedPages.slice(1)
    }

    build_nested_pages_inner(pageListWithTitle, level) {
        let self = this
        , chapters = []
        , prevChapterNum = 0
        ,  getIndex = (list, Indexinner) => {
            for(let i in list) {
                if(list[i].index === Indexinner)return i
            }
            return NaN
        }
        for(let i in pageListWithTitle) {
            let filePath = pageListWithTitle[i].path
            
            let parts = filePath.split('.')
            let chapterNum = parseInt(parts[0].replace('/', ''))
            if(!isNaN(chapterNum));
            else {
                chapterNum = prevChapterNum + 1
            }
            prevChapterNum = chapterNum
            
            if(!chapters[chapterNum]) {
                parts = filePath.split('/')
                let folderPart = '/' + parts[1];
                let {numFiles, files_in_dir} = pageListWithTitle.reduce((accumulator, currentValue, currentIndex, originalPageListArray) => {
                    
                    let testLen = currentValue.path.split('/').length
                    
                    let testLenResult = testLen===3 || testLen===4?true:false;
                    if(currentValue.path.indexOf(accumulator.needle) === 0) {
                        
                        accumulator.numFiles++
                        accumulator.files_in_dir.push({name:currentValue.path , index: currentValue.index})
                    }
                    
                    return accumulator
                }, {needle:folderPart, numFiles:0, files_in_dir:[] })
                
                chapters[chapterNum] = {
                    slug: pageListWithTitle[i].slug,
                    title: pageListWithTitle[i].title,
                    chapterNum:chapterNum,
                    show_on_home: true,
                    is_directory: numFiles > 1?true:false,
                  
                }
               
                if(level === 0) numFiles--;
                if (numFiles > 0) {

                    if(level === 0) {
                        // let removed = files_in_dir.reverse().pop()
                        // files_in_dir.reverse()
                    }
                    chapters[chapterNum].files = []
                    
                    let pageListWithTitleInner = []
                    for(let j in files_in_dir) {
                        let item = files_in_dir[j]
                        let itemNameParts = item.name.split('/')
                        let indexInner = item.index
                        let pathinner = '/' + itemNameParts.slice((level+2)).join('/')

                        let itemInner = {
                            path: pathinner,
                            index: item.index,
                            slug: pageListWithTitle[getIndex(pageListWithTitle, indexInner)].slug,
                            title: pageListWithTitle[getIndex(pageListWithTitle, indexInner)].title
                        }
                        if(pathinner !== '/')
                            pageListWithTitleInner.push(itemInner)
                    }
                    chapters[chapterNum].files = self.build_nested_pages_inner(pageListWithTitleInner, level+1, chapters[chapterNum].breadCrumbs).slice(1)
                    
                } else chapters[chapterNum].is_index = true
                
            }
            
        }
        return chapters
    }

    
    loadPagesList(content_dir) {
        let self = this
        let files = self.listFiles(content_dir);
        files = _.filter(files, function (file) {
            return file.substr(-3) === '.md';
        });

        let filesPath = files.map(function (file) {
            return file.replace(content_dir, '');
        });

        // let originalFilesPath = [ ...filesPath ];

        // generate list filePaths

        let urls = filesPath.map(function (file) {
            file =  file.replace('.md', '').replace('\\', '/');
            if(file.substr(-5) === '/docs') file = file.substr(0, file.length - 5)  + '/00.docs'
            if(file.substr(-8) === '/chapter')  file = file.substr(0, file.length - 8) + '/00.chapter'
            return file
        });
        urls.sort();
        let originalUrls = urls.map(function (file) {
            file =  file.replace('.md', '').replace('\\', '/');
            return file + '.md'
        });
        urls = urls.map(function (file) {
            file =  file.replace('/00.docs', '').replace('/00.chapter', '')
            return file
        });
        originalUrls = originalUrls.map(function (file) {
            file =  file.replace('/00.docs.md', '/docs.md')
            return file
        });
     
        
        for(let i in urls)urls[i] = urls[i].replace(/\/[0-9]+\./g, '/').replace(/^[0-9]+\./g, '')
        
        let nestedPages = self.build_nested_pages(originalUrls, urls, content_dir)
        return {original:originalUrls, modified:urls, nestedPages}
    }

	

}

module.exports = new Csystem