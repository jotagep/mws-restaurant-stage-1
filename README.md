# Mobile Web Specialist Certification Course
## Installation

-  Clone server repo: [Server Stage 2](https://github.com/udacity/mws-restaurant-stage-2) and follow them to start the server.

- Clone my repo in your computer and install **node modules** and dependencies

```
$ git git@github.com:jotagep/mws-restaurant-udacity.git
$ cd mws-restaurant-udacity
$ npm install
```
- Run a build version(optimized), with this command:

`$ gulp serve:dist` or `$ npm run serve:dist`

You can see your site live at port __8000__: [http://localhost:8000/](http://localhost:8000/)

---

#### _Three Stage Course Material Project - Restaurant Reviews_

## Stage 1 -- (DONE)

## Stage 2 -- (DONE)

### Requirements

**Use server data instead of local memory** In the first version of the application, all of the data for the restaurants was stored in the local application. You will need to change this behavior so that you are pulling all of your data from the server instead, and using the response data to generate the restaurant information on the main page and the detail page.

**Use IndexedDB to cache JSON responses** In order to maintain offline use with the development server you will need to update the service worker to store the JSON received by your requests using the IndexedDB API. As with **Stage One**, any page that has been visited by the user should be available offline, with data pulled from the shell database.

**Meet the minimum performance requirements** Once you have your app working with the server and working in offline mode, you’ll need to measure your site performance using Lighthouse.

Lighthouse measures performance in four areas, but your review will focus on three:

- **Progressive Web App** score should be at **90** or better.
- **Performance** score should be at **70** or better.
- **Accessibility** score should be at **90** or better.

You can audit your site's performance with Lighthouse by using the Audit tab of Chrome Dev Tools.

### My results

Provided by Lighthouse

![alt text](http://i63.tinypic.com/dxb7sy.png "Test results stage 2")

---

#### Thanks all! Fork and enjoy this repo! 👍


