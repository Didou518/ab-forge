/**
 *	Replaces {{fileName}} in source file with the processed content of filename.ext
 *
 * @param {String} data The source data which contains the replacements to be done ie. the source file
 * @param {String} fileName The name of the file to be inserted
 * @param {String} content The processed content of the file that will be inserted
 */
function replaceContent(data, fileName, fileExt, content) {
	return data.replace(new RegExp(`{{${fileExt}/${fileName}}}`, 'g'), `${content}`)
}

export default replaceContent
