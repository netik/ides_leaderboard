# Testing some javascript in 2017

This is a repo that will handle giving a minimum example that meets
these modern javascript requirements used in many projects:

    - Can use ES6 syntax in the browser
    - Can load modules via require or import/export (ES6) syntax
    - Can render/manipulate DOM via React/JSX
    - Can provide a build bundle, or a watch based build for dev

Blog post to come soon!

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-generate-toc again -->
**Table of Contents**

- [Testing some javascript in 2017](#testing-some-javascript-in-2017)
- [Setup](#setup)
    - [Create your directory structure](#create-your-directory-structure)
- [License](#license)

<!-- markdown-toc end -->

# Setup

Well, you could always just clone this repository, but if you'd like
to do things from scratch:

## Create your directory structure

First, create the directory for your source code:

```
mkdir -p ./js-2017/src && cd ./js-2017
```

Then download the pre-built React build from here:

https://facebook.github.io/react/downloads/react-15.0.1.zip

and unzip/copy the `build` directory into your project root:

```
wget https://facebook.github.io/react/downloads/react-15.0.1.zip
unzip react-15.0.1.zip
cp -ar ./react-15.0.1/build ./
```

and set up your npm package as follows:

```
npm init -y
npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
```

All that's left after that is to copy/paste from this repo into your
repo the js files in src, the index.html file, and the
webpack.config.js file, then run:

```
npm run build
```

to generate dist/bundle.js, or run this to keep a listening service on
your files so you can refresh in browser and immediately see the
changes:

```
npm run start
```

# License

GPLv3
