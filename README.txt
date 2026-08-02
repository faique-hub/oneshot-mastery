REVISE. — FOLDER-BASED WEBSITE

HOW TO ADD CONTENT
==================
1. Open the content folder.
2. Put files in the correct subject folder:

   content/notes/Science/               -> Notes files
   content/short-notes/Science/         -> Short Notes files
   content/pyqs/Science/                -> PYQ files
   content/mindmaps/Science/            -> Mind Map IMAGES only

   The same structure exists for Mathematics, Social Science, English and Hindi.

3. Double-click START_WEBSITE.bat.
   It automatically runs build_content.py, refreshes the website file list,
   starts a local web server and opens the website.

ADDING A NEW SUBJECT
====================
Create a folder with the same subject name inside EACH category you want to use. Example:

content/notes/Computer Science/
content/short-notes/Computer Science/
content/pyqs/Computer Science/
content/mindmaps/Computer Science/

Then run START_WEBSITE.bat again.

PUBLISHING
==========
Before publishing, run build_content.py or START_WEBSITE.bat once.
Then upload the ENTIRE Revise_Publish_Ready folder to your web host.
Do not upload only index.html because the PDFs/images are separate files.

You can publish this static folder on services such as GitHub Pages, Netlify,
or another static hosting provider. Keep the same folder structure.

IMPORTANT
=========
- Notes, Short Notes and PYQs can be PDFs or other ordinary files.
- Mind Maps accept image formats only: JPG, JPEG, PNG, WEBP, GIF, SVG.
- PDF and images preview in the website. Other file types may download/open externally.
- Your content is stored as real files in this project, not browser localStorage.
- Keep a backup copy of this whole folder.
