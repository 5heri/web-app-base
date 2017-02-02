# react-portal-renderer
Reusable React component that renders pages of the captive portal

## How to build the component

1. `> cd js-react-portal-renderer` 

2. `> npm run dev`

3. The above command should be kept running during development

## How to commit your changes and update this repo
1. [Run the build process](#how-to-build-the-component) to build your changes

2. Your commits for `src` and `build` files should always be separate, so commit your changes using something like:

  ```
  > git add src
  > git commit -m 'TICKET-NUMBER <Commit Message>'
  > git add build
  > git commit -m 'TICKET-NUMBER Commit build files'
  ```

3. Submit a pull request

## How to work on this repo locally

Use case: 
- You are modifying behaviour on `<PortalRenderer>` via `props` passed in from a parent repo (i.e. Wifast-Base, py-portal)

WARNING: For an unknown reason, restarting `Wifast-Base` with the following code in place causes the build process to never complete. Thus, always restart `Wifast-Base` in a clean state and THEN insert the modified imports.

### Instructions

1. This repository should have been `git clone`d into the same root directory as your _parent repo_ (i.e. Wifast-Base/py-portal)

3. Make sure your [build process](#how-to-build-the-component) is running

4. In the relevant files of your parent repo, replace the JS import like this:

  ```
  // import PortalRenderer from 'js-react-portal-renderer'
  import PortalRenderer from '../../../../../../../../js-react-portal-renderer/src/js/views/portal-renderer.js'
  ```
  
  - First line: the original `import` statement
  - Second line: the `import` statement for your local version of `<PortalRenderer>`
  - Note: This method imports the pre-compiled JS file, so any errors on build will show up in either your parent repo's build process or in the `npm run dev` trace.
  
5. If you are making style changes, replace the CSS import like this:

  ```
  // require('js-react-portal-renderer/build/css/portalrenderer.css')` 
  require('../../../../../../../../js-react-portal-renderer/build/css/portalrenderer.css')
  ```

  - First line: the original `require` statement
  - Second line: the `require` statement for your local version of `<PortalRenderer>` styles
  - Note: This method imports the post-compilation SCSS so any errors on build will only be visible in the `npm run dev` trace and not in the parent repo. 
  
5. When you are done with development, follow [the instructions above](#how-to-commit-your-changes-and-update-this-repo)

## How to create a new version tag for js-react-portal-renderer

Wifast-Base and py-portal import this module by a tagged version number.  Below is how new version numbers should be created.

1.  Ensure you have your local machine set up to create signed git tags.  See first section of document below for instructions:
 
	https://zenreach.quip.com/GBVwA6Gmw13O
	
2. Merge the master branch of js-react-portal-renderer into release via:

   ```
   git checkout release
   git pull
   git merge origin/master
   git push
   ```
   
3.  Get the list of tags and find the largest version.

   ```
   git tag
   ```

3.  Create a new (signed) version tag.

   ```
   git tag -s <new version> # i.e. 'git tag -s 1.0.0'
   git push --tag
   ```
