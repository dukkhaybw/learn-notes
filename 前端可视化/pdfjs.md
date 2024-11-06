需求：

1. 实现一套基于PDF文档的审批流程，审批流程的逻辑：首先被审批人上传相关的Word或PDF文档，然后发起审批流，这个文档进入审批流程

2. 这个审批在进入审批状态后，将会被一个或多个审批人审批

3. 审批人可以在被审批人上传的PDF文档上增加、删除、修改、查看、移动、定位各种批注信息

4. 对于不同的批注，不同的审批人具有不同的操作权限

   

开发要求：

1. 把PDF的展示和批注管理实现

PDF.js本身提供的功能主要是面向文档展示，除了展示相关的功能之外，只提供了较少的批注功能，并且没有直接操作批注的API。也只留下了较少扩展的接口让开发者将自己的代码加入到PDF.js的流程当中去。将PDF.js集成进去也比较困难。因此需要对PDF.js进行一系列的改造。





为了实现上面的功能和目标，在PDF.js-4.0.379版本的源码的基础上做改动。改动大体上可以通过两个视角来看待。

- 功能的视角
- 代码的视角

从功能的视角来看，做出的改动和新增的功能有：

1. 批注分离功能。改造批注相关的类、函数和生成逻辑，添加了一系列的API，让使用者直接高效的操作批注。
2. 新增四类批注——框选、下划线、删除、指向箭头。
3. 对现有批注进行改进，增加一些新的信息，如高亮时的文本信息等，并对原来的批注做一定的改动
4. 新增一些参数供用户自由的操作PDF.js。包括指定加载页数参数：loadPageIndex。控制批注操作权限：permitToEdit。控制分片大小rangeChunkSize。
5. 初始化批注功能，在页面加载完毕后，自动将历史的批注从后台读取并渲染出来。
6. 高效批注分片加载，PDF的Catalog组织情况、PDF对象引用结构调整以及解决跨域问题。
7. 给批注控制增加权限管理，业务系统可以通过权限字段控制批注是否可编辑。



从代码的视角来看，改动的有：

- 管理批注生命周期，在批注创建、初始化、修改、删除等时刻增加钩子，供调用者加入业务逻辑。
- 管理页加载周期，并在页开放周期过程中，添加钩子，供用户植入业务逻辑。如文档加载完后的渲染。



可扩展功能：

- 同时开启多个阅读器，进行多文档比对。
- 控制历史批注，按版本支持对批注的展示。



PDF.js从功能上讲主要是一个PDF阅读器。主要是展示PDF，至于修改PDF之类的功能是涉及的还是比较少的。

PDF.js的阅读器由两部分组成：

- 提供基础功能的源码，这个源码在src目录下
- 一个个具体的、可用的阅读器，在web目录下

优化PDF展示和批注管理所做的开发，基本是通过改造PDF阅读器源码的两部分 和 部分修改PDF目录结构是通过Java的PDFBox库实现的。



### 如何实现对PDF.js改造

分析代码目录和结构、调试PDF.js启动流程，从而来对PDF.js有一个全面且有一定深度的了解。



### 源码结构

src目录：

![image-20240819180421863](D:\learn-notes\前端可视化\images\image-20240819180421863.png)

重点关注两个目录：

- core

  core存放的是整个PDF.js最底层的js文件。该目录下的文件直接操作和解析PDF文件，通过读取PDF文件，该目录下的文件能够解析出如PDF文档的Catalog（目录）、PageTree（页面树）、XRef（交叉引用表）之类的基础信息，也能够解析出每一个PDF Page（页）的数据以及该页中引用对象的信息。

  PDF的基础数据信息及其组织形式，是决定PDF是否能够有效分片加载的关键。通过不同工具生成的PDF，其具备的分片加载的能力是不同的。有的能够高效分片加载，有的则完全不能够分片加载。

  当阅读器对PDF的解析出现问题时，就需要对这一层的代码进行调试，才能更加有效的定位到问题。不过这一层的代码主要是调试用，改动则是非常少。在这个目录下修改的基本上只是一些参数信息而不包含解析PDF相关的逻辑信息。

- display

  display代表的是展示层。它基于core。它使用核心层的API来获取文档和页面的数据并渲染到HTML页面上去。

  该目录下文件代码包含的主要功能有：

  - 通过读取PDF文件流、构建PDF展示结构、生成相关批注、提供一系列操作PDF相关的API等。

  这一层是改造的重点。display目录的editor子目录存放了一系列批注的实现代码和控制代码。PDF.js自带的批注有绘图、图像、文本、高亮。对于editor子目录，做大量的改动，新增内容。

上面的两部分是PDF.js本身处理PDF文档信息和展示的源代码。在这些源代码的基础上，PDF.js又开发了优秀的PDF阅读器。它主要的实现代码不在src目录下，而是在web目录下面。

web目录下，最主要的就是viewer.html、viewer.js、viewer.css以及相关的文件。这些文件也是改造的重点，通过改造这些文件，可以有效的将PDF.js作为一个PDF阅读器嵌入到现有的系统当中去。并且可以根据实际业务需要，添加更多定制化的功能。



### PDF.js启动加载PDF流程

PDF.js里面有着大量的异步操作，也大量的使用了Promise来处理各种逻辑。

PDF.js阅读器的启动过程以及启动中主要涉及到的比较关键的点。

PDF.js的第一行代码，始于viewer.js。首先它先定义了一些对象和类，但是没有初始化，并且将这些类挂在了全局对象window下，可以通过windiow来访问这些对象。下面是PDF.js阅读器逻辑开始的地方：

```js
import { RenderingStates, ScrollMode, SpreadMode } from "./ui_utils.js";
import { AppOptions } from "./app_options.js";
import { LinkTarget } from "./pdf_link_service.js";
import { PDFViewerApplication } from "./app.js";

const AppConstants =
  typeof PDFJSDev === "undefined" || PDFJSDev.test("GENERIC")
    ? { LinkTarget, RenderingStates, ScrollMode, SpreadMode }
    : null;

// 整个应用最主要的类，它即对应阅读器本身
window.PDFViewerApplication = PDFViewerApplication;

// 这里主要是一些常量
window.PDFViewerApplicationConstants = AppConstants;

// 这里面包含了App的一些配置，尤其是大量的默认配置都在这里面
// 想要给阅读器添加参数或修改参数
// 不要直接操作，而是通过AppOptions来操作
window.PDFViewerApplicationOptions = AppOptions;
```

初始化几个重要且基本的对象之后，viewer.js读取了页面的dom信息，并用这些dom信息初始化PDFViewApplication对象。页面上的组件dom特别的多。如果要想加一些自己的按钮或功能上去，并希望能够将逻辑加入到PDF.js当中去，那么下面就是第一个要改造的点。在实际的开发过程中，增加了四个按钮，因而也在这里增加了四个dom对象。

```js
function getViewerConfiguration() {
  return {
    appContainer: document.body,
    mainContainer: document.getElementById("viewerContainer"),
    viewerContainer: document.getElementById("viewer"),
    toolbar: {
      container: document.getElementById("toolbarViewer"),
      numPages: document.getElementById("numPages"),
      pageNumber: document.getElementById("pageNumber"),
      scaleSelect: document.getElementById("scaleSelect"),
      customScaleOption: document.getElementById("customScaleOption"),
      previous: document.getElementById("previous"),
      next: document.getElementById("next"),
      zoomIn: document.getElementById("zoomIn"),
      zoomOut: document.getElementById("zoomOut"),
      // ...
      download: document.getElementById("download"),
    },
    secondaryToolbar: {
      toolbar: document.getElementById("secondaryToolbar"),
      toggleButton: document.getElementById("secondaryToolbarToggle"),
      presentationModeButton: document.getElementById("presentationMode"),
      openFileButton:
      typeof PDFJSDev === "undefined" || PDFJSDev.test("GENERIC")
      ? document.getElementById("secondaryOpenFile")
      : null,
      // ...
    },
    sidebar: {
      // Divs (and sidebar button)
      outerContainer: document.getElementById("outerContainer"),
      sidebarContainer: document.getElementById("sidebarContainer"),
      toggleButton: document.getElementById("sidebarToggle"),
      resizer: document.getElementById("sidebarResizer"),
      // Buttons
      thumbnailButton: document.getElementById("viewThumbnail"),
      outlineButton: document.getElementById("viewOutline"),
      attachmentsButton: document.getElementById("viewAttachments"),
      layersButton: document.getElementById("viewLayers"),
      // Views
      thumbnailView: document.getElementById("thumbnailView"),
      outlineView: document.getElementById("outlineView"),
      attachmentsView: document.getElementById("attachmentsView"),
      layersView: document.getElementById("layersView"),
      // View-specific options
      currentOutlineItemButton: document.getElementById("currentOutlineItem"),
    },
    findBar: {
      bar: document.getElementById("findbar"),
      // ..
    },
    passwordOverlay: {
      // ...
    },
    documentProperties: {
      dialog: document.getElementById("documentPropertiesDialog"),
      closeButton: document.getElementById("documentPropertiesClose"),
      fields: {
        fileName: document.getElementById("fileNameField"),
        fileSize: document.getElementById("fileSizeField"),
        // ...
      },
    },
    altTextDialog: {
      // ...
    },
    newAltTextDialog: {
      // ... 
    },
    altTextSettingsDialog: {
      // ...
    },
    annotationEditorParams: {
      // ..
    },
    printContainer: document.getElementById("printContainer"),


    // 自定义新增的按钮
    appContainer: document.body,
    mainContainer: document.getElementById("viewerContainer"),
    viewerContainer: document.getElementById("viewer"),

  };
}

```



```js
const PDFViewerApplication = { 
  // ...
  async run(config) {
    // ...
    await this.initialize(config);
    // ...
  }

  async initialize(appConfig) {
    // ...
    await this._initializeViewerComponents();

    this.bindEvents();
    this.bindWindowEvents();
  }
}
```



最开始的启动过程中，初始化PDFViewApplication主要就靠下面两个方法：getViewerConfiguration负责读取dom信息，run负责利用dom信息来初始化PDFViewerApplication对象。

初始化方法`initialize`里面包含很内容，如夜间模式、页面朝向（针对手机的）、多语言（不考虑）等。只考虑比较重要的那一部分。也就是上面的代码里展示的几行比较关键的代码。

`_initializeViewerComponents`这个方法主要就是初始化阅读器里面的一系列组件。主要的的是EventBus、PDFViewer。

PDF阅读器使用EventBus作为总线，来达到方法本身和调用者解耦的目的。想要调用PDFViewerApplication的API，无需知道API在哪里、具体实现是怎样的，只要告知EventBus想要调用什么API、参数是什么，EventBus会找到对应的API的调用者，并让其根据参数来执行相应的代码。当然，这个调用者可能不存在，也可能有多个。假如现在的PDF页面在100页，但是希望跳转到200页，通常情况下，开发者会使用类似于下面的代码`viewer.jumpToPage(200)`来达成自己的跳转的目标。但是在PDF.js里面并不是这样，在PDF.js里，如果你想要跳转到某一页，应该向EventBus发送请求，告知EventBus，你要跳转到这一页。EventBus会根据你的请求类型和参数来帮你找到合适的代码执行器并执行跳转逻辑。

下面是两段简短的代码，用来说明在PDF.js种如何通过EventBus来实现功能调用：

```js
// 调用方式
const eventBus = getEventBus();

// 想跳转到200页，通过向eventBus发送消息来达成目的
// jumpToPage只是举例用的，PDF.js里并没有这个消息类型
eventBus.dispatch("jumpToPage", { page : 200 })
```



```js
// eventBus收到了发来的"jumpToPage"信息，开始准备处理
// 它先找到能处理jumpToPage命令的处理器
const listeners = eventBus.findListeners(type);
// 然后逐个执行
for(const listener of listeners)
    listener.listen(params);
```



- 让方法调用变得统一而简单，用户无需了解整个PDF的实现原理，也无需接触PDF.js内部的类，只需要知道有哪些API可以调用，参数分别是什么。搜索PDF内容、跳转页面、放缩页面大小等一系列操作，都可以通过这种方式来进行调用。不过，目前没有找到一个写的比较好的PDF的API文档，想要通过这种方式去调用PDF.js内部的API，必须要自己去研究PDF.js内部注册了哪些API的处理器。
- 可以自己增加处理逻辑，让程序在执行到一定的阶段的时候，可以把自己的代码也一并执行。不仅可以作为调用者来使用EventBus，也可以向EventBus注册自己的处理方法，让自己成为被调用者。举个例子，在UI处理器加载完毕后。PDF.js会通过EventBus发送`annotationeditoruimanager`来告知系统UI处理器已经加载完毕了，EventBus里注册的处理器在收到消息之后，就会执行处理代码了。在EventBus初始化的过程中，我们也可以添加一个自己的处理器，来监听类型为`annotationeditoruimanager`的消息。这样在EventBus收到`annotationeditoruimanager`处理请求的时候，就不仅仅会处理它自己的逻辑，还会把新增的逻辑也执行了。
- 可以通过这种方式将自己的逻辑加入到viewer的启动过程中去了。通过这种方式，增加了一系列的钩子，通过这些钩子增加PDF阅读器的扩展能力。除此之外，还监听了文档加载完毕的消息，在文档加载完毕后，会从从数据库拉取一系列的批注，并加载到阅读器上面去。



PDF.js在EventBus中注册了大量的的处理器。上述的代码中调用的`this.bindEvents()`方法就是在向EventBus注册处理器。

```js
bindEvents() {
  const { eventBus, _boundEvents } = this;
  ...
  eventBus._on("resize", webViewerResize);
  eventBus._on("hashchange", webViewerHashchange);
  eventBus._on("beforeprint", _boundEvents.beforePrint);
  eventBus._on("afterprint", _boundEvents.afterPrint);
  eventBus._on("pagerender", webViewerPageRender);
  eventBus._on("pagerendered", webViewerPageRendered)
  ...
}
```



PDFViewer是另一个重要的对象，它是整个阅读器的核心部分。里面包含的东西非常多。它涉及到整个PDFViewer的生命周期。

```js
const pdfViewer = new PDFViewer({
  container,
  viewer,
  eventBus,
  renderingQueue: pdfRenderingQueue,
  linkService: pdfLinkService,
  downloadManager,
  altTextManager,
  findController,
  scriptingManager:
  AppOptions.get("enableScripting") && pdfScriptingManager,
  l10n,
  textLayerMode: AppOptions.get("textLayerMode"),
  annotationMode: AppOptions.get("annotationMode"),
  annotationEditorMode,
  annotationEditorHighlightColors: AppOptions.get("highlightEditorColors"),
  enableHighlightFloatingButton: AppOptions.get(
    "enableHighlightFloatingButton"
  ),
  enableUpdatedAddImage: AppOptions.get("enableUpdatedAddImage"),
  enableNewAltTextWhenAddingImage: AppOptions.get(
    "enableNewAltTextWhenAddingImage"
  ),
  imageResourcesPath: AppOptions.get("imageResourcesPath"),
  enablePrintAutoRotate: AppOptions.get("enablePrintAutoRotate"),
  maxCanvasPixels: AppOptions.get("maxCanvasPixels"),
  enablePermissions: AppOptions.get("enablePermissions"),
  pageColors,
  mlManager: this.mlManager,
  abortSignal: this._globalAbortController.signal,
  enableHWA,
});
this.pdfViewer = pdfViewer;
```



#### 加载文档

在基本的对象初始化之后，PDFViewerApplication就开始了加载PDF文档。

```js
// 加载文档的关键代码
this.open({ url: file });

/**
   * Opens a new PDF document.
   * @param {Object} args - Accepts any/all of the properties from
   *   {@link DocumentInitParameters}, and also a `originalUrl` string.
   * @returns {Promise} - Promise that is resolved when the document is opened.
   */
async open(args) {
  if (this.pdfLoadingTask) {
    // We need to destroy already opened document.
    await this.close();
  }
  // Set the necessary global worker parameters, using the available options.
  const workerParams = AppOptions.getAll(OptionKind.WORKER);
  Object.assign(GlobalWorkerOptions, workerParams);

  if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
    if (args.data && isPdfFile(args.filename)) {
      this._contentDispositionFilename = args.filename;
    }
  } else if (args.url) {
    // The Firefox built-in viewer always calls `setTitleUsingUrl`, before
    // `initPassiveLoading`, and it never provides an `originalUrl` here.
    this.setTitleUsingUrl(
      args.originalUrl || args.url,
      /* downloadUrl = */ args.url
    );
  }

  // Set the necessary API parameters, using all the available options.
  const apiParams = AppOptions.getAll(OptionKind.API);
  // 打开文档的关键函数
  // 在这个函数中，PDF完成了从网络中加载数据
  // 并将数据转换成PDF文档
  const loadingTask = getDocument({
    ...apiParams,
    ...args,
  });
  this.pdfLoadingTask = loadingTask;

  loadingTask.onPassword = (updateCallback, reason) => {
    if (this.isViewerEmbedded) {
      // The load event can't be triggered until the password is entered, so
      // if the viewer is in an iframe and its visibility depends on the
      // onload callback then the viewer never shows (bug 1801341).
      this._unblockDocumentLoadEvent();
    }

    this.pdfLinkService.externalLinkEnabled = false;
    this.passwordPrompt.setUpdateCallback(updateCallback, reason);
    this.passwordPrompt.open();
  };

  loadingTask.onProgress = ({ loaded, total }) => {
    this.progress(loaded / total);
  };

  return loadingTask.promise.then(
    pdfDocument => {
      this.load(pdfDocument);
    },
    reason => {
      if (loadingTask !== this.pdfLoadingTask) {
        return undefined; // Ignore errors for previously opened PDF files.
      }

      let key = "pdfjs-loading-error";
      if (reason instanceof InvalidPDFException) {
        key = "pdfjs-invalid-file-error";
      } else if (reason instanceof MissingPDFException) {
        key = "pdfjs-missing-file-error";
      } else if (reason instanceof UnexpectedResponseException) {
        key = "pdfjs-unexpected-response-error";
      }
      return this._documentError(key, { message: reason.message }).then(
        () => {
          throw reason;
        }
      );
    }
  );
},

```



```js
function getDocument(src = {}) {
  if (typeof PDFJSDev === "undefined" || PDFJSDev.test("GENERIC")) {
    if (typeof src === "string" || src instanceof URL) {
      src = { url: src };
    } else if (src instanceof ArrayBuffer || ArrayBuffer.isView(src)) {
      src = { data: src };
    }
  }
  const task = new PDFDocumentLoadingTask();
  const { docId } = task;

  const url = src.url ? getUrlProp(src.url) : null;
  const data = src.data ? getDataProp(src.data) : null;
  const httpHeaders = src.httpHeaders || null;
  const withCredentials = src.withCredentials === true;
  const password = src.password ?? null;
  const rangeTransport =
    src.range instanceof PDFDataRangeTransport ? src.range : null;
  const rangeChunkSize =
    Number.isInteger(src.rangeChunkSize) && src.rangeChunkSize > 0
      ? src.rangeChunkSize
      : DEFAULT_RANGE_CHUNK_SIZE;
  let worker = src.worker instanceof PDFWorker ? src.worker : null;
  const verbosity = src.verbosity;
  // Ignore "data:"-URLs, since they can't be used to recover valid absolute
  // URLs anyway. We want to avoid sending them to the worker-thread, since
  // they contain the *entire* PDF document and can thus be arbitrarily long.
  const docBaseUrl =
    typeof src.docBaseUrl === "string" && !isDataScheme(src.docBaseUrl)
      ? src.docBaseUrl
      : null;
  const cMapUrl = typeof src.cMapUrl === "string" ? src.cMapUrl : null;
  const cMapPacked = src.cMapPacked !== false;
  const CMapReaderFactory = src.CMapReaderFactory || DefaultCMapReaderFactory;
  const standardFontDataUrl =
    typeof src.standardFontDataUrl === "string"
      ? src.standardFontDataUrl
      : null;
  const StandardFontDataFactory =
    src.StandardFontDataFactory || DefaultStandardFontDataFactory;
  const ignoreErrors = src.stopAtErrors !== true;
  const maxImageSize =
    Number.isInteger(src.maxImageSize) && src.maxImageSize > -1
      ? src.maxImageSize
      : -1;
  const isEvalSupported = src.isEvalSupported !== false;
  const isOffscreenCanvasSupported =
    typeof src.isOffscreenCanvasSupported === "boolean"
      ? src.isOffscreenCanvasSupported
      : !isNodeJS;
  const canvasMaxAreaInBytes = Number.isInteger(src.canvasMaxAreaInBytes)
    ? src.canvasMaxAreaInBytes
    : -1;
  const disableFontFace =
    typeof src.disableFontFace === "boolean" ? src.disableFontFace : isNodeJS;
  const fontExtraProperties = src.fontExtraProperties === true;
  const enableXfa = src.enableXfa === true;
  const ownerDocument = src.ownerDocument || globalThis.document;
  const disableRange = src.disableRange === true;
  const disableStream = src.disableStream === true;
  const disableAutoFetch = src.disableAutoFetch === true;
  const pdfBug = src.pdfBug === true;
  const enableHWA = src.enableHWA === true;

  // Parameters whose default values depend on other parameters.
  const length = rangeTransport ? rangeTransport.length : (src.length ?? NaN);
  const useSystemFonts =
    typeof src.useSystemFonts === "boolean"
      ? src.useSystemFonts
      : !isNodeJS && !disableFontFace;
  const useWorkerFetch =
    typeof src.useWorkerFetch === "boolean"
      ? src.useWorkerFetch
      : (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) ||
        (CMapReaderFactory === DOMCMapReaderFactory &&
          StandardFontDataFactory === DOMStandardFontDataFactory &&
          cMapUrl &&
          standardFontDataUrl &&
          isValidFetchUrl(cMapUrl, document.baseURI) &&
          isValidFetchUrl(standardFontDataUrl, document.baseURI));
  const canvasFactory =
    src.canvasFactory || new DefaultCanvasFactory({ ownerDocument, enableHWA });
  const filterFactory =
    src.filterFactory || new DefaultFilterFactory({ docId, ownerDocument });

  // Parameters only intended for development/testing purposes.
  const styleElement =
    typeof PDFJSDev === "undefined" || PDFJSDev.test("TESTING")
      ? src.styleElement
      : null;

  // Set the main-thread verbosity level.
  setVerbosityLevel(verbosity);

  // Ensure that the various factories can be initialized, when necessary,
  // since the user may provide *custom* ones.
  const transportFactory = {
    canvasFactory,
    filterFactory,
  };
  if (!useWorkerFetch) {
    transportFactory.cMapReaderFactory = new CMapReaderFactory({
      baseUrl: cMapUrl,
      isCompressed: cMapPacked,
    });
    transportFactory.standardFontDataFactory = new StandardFontDataFactory({
      baseUrl: standardFontDataUrl,
    });
  }

  if (!worker) {
    const workerParams = {
      verbosity,
      port: GlobalWorkerOptions.workerPort,
    };
    // Worker was not provided -- creating and owning our own. If message port
    // is specified in global worker options, using it.
    worker = workerParams.port
      ? PDFWorker.fromPort(workerParams)
      : new PDFWorker(workerParams);
    task._worker = worker;
  }

  const docParams = {
    docId,
    apiVersion:
      typeof PDFJSDev !== "undefined" && !PDFJSDev.test("TESTING")
        ? PDFJSDev.eval("BUNDLE_VERSION")
        : null,
    data,
    password,
    disableAutoFetch,
    rangeChunkSize,
    length,
    docBaseUrl,
    enableXfa,
    evaluatorOptions: {
      maxImageSize,
      disableFontFace,
      ignoreErrors,
      isEvalSupported,
      isOffscreenCanvasSupported,
      canvasMaxAreaInBytes,
      fontExtraProperties,
      useSystemFonts,
      cMapUrl: useWorkerFetch ? cMapUrl : null,
      standardFontDataUrl: useWorkerFetch ? standardFontDataUrl : null,
    },
  };
  const transportParams = {
    disableFontFace,
    fontExtraProperties,
    ownerDocument,
    pdfBug,
    styleElement,
    loadingParams: {
      disableAutoFetch,
      enableXfa,
    },
  };

  worker.promise
    .then(function () {
      if (task.destroyed) {
        throw new Error("Loading aborted");
      }
      if (worker.destroyed) {
        throw new Error("Worker was destroyed");
      }

      const workerIdPromise = worker.messageHandler.sendWithPromise(
        "GetDocRequest",
        docParams,
        data ? [data.buffer] : null
      );

      let networkStream;
      if (rangeTransport) {
        networkStream = new PDFDataTransportStream(rangeTransport, {
          disableRange,
          disableStream,
        });
      } else if (!data) {
        if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
          throw new Error("Not implemented: createPDFNetworkStream");
        }
        if (!url) {
          throw new Error("getDocument - no `url` parameter provided.");
        }
        const createPDFNetworkStream = params => {
          if (
            typeof PDFJSDev !== "undefined" &&
            PDFJSDev.test("GENERIC") &&
            isNodeJS
          ) {
            const isFetchSupported = function () {
              return (
                typeof fetch !== "undefined" &&
                typeof Response !== "undefined" &&
                "body" in Response.prototype
              );
            };
            return isFetchSupported() && isValidFetchUrl(params.url)
              ? new PDFFetchStream(params)
              : new PDFNodeStream(params);
          }
          return isValidFetchUrl(params.url)
            ? new PDFFetchStream(params)
            : new PDFNetworkStream(params);
        };

        networkStream = createPDFNetworkStream({
          url,
          length,
          httpHeaders,
          withCredentials,
          rangeChunkSize,
          disableRange,
          disableStream,
        });
      }

      return workerIdPromise.then(workerId => {
        if (task.destroyed) {
          throw new Error("Loading aborted");
        }
        if (worker.destroyed) {
          throw new Error("Worker was destroyed");
        }

        const messageHandler = new MessageHandler(docId, workerId, worker.port);
        const transport = new WorkerTransport(
          messageHandler,
          task,
          networkStream,
          transportParams,
          transportFactory
        );
        task._transport = transport;
        messageHandler.send("Ready", null);
      });
    })
    .catch(task._capability.reject);

  return task;
}
```





因为文档一般都是在服务器上的，因此只考虑加载服务器上的文档。 viewer请求加载远程服务器上的文件有非常多的参数，如url、httpHeaders、password、disableRange、rangeChunkSize等。如果想要对viewer请求服务器这个逻辑进行调参，可以调试`getDocument`里组装参数相关的代码。

其请求文档的时候，也没有直接调用请求文档相关的逻辑，而是通过`MessageHandler`（类似于前面的EventBus，但不是EventBus，是专门用于请求相关的调用。因为请求相关的应用比直接调用的逻辑要更复杂一些，因此不直接使用EventBus来操作）发送`GetDocRequest`来请求具体的文档数据。

`MessageHandler`对`GetDocRequest`的处理是至关重要的。其处理的主要逻辑只有一行代码，就是创建了`DocumentHandler`，实际代码如下：

```js
const workerIdPromise = worker.messageHandler.sendWithPromise(
  "GetDocRequest",
  docParams,
  data ? [data.buffer] : null
);

handler.on("GetDocRequest", function (data) {
  return WorkerMessageHandler.createDocumentHandler(data, port);
});
```

参数data是前面组装viewer请求加载远程服务器上的文件的参数。`createDocumentHandler`这个函数里面的逻辑是比较多的。但是最主要的方法仍然是容易找到的，就是如下方法：

```js
async function loadDocument(recoveryMode) {
  ....
}
```

在后续的代码中，只考虑分片加载的情况，不再考虑其它情况。`createDocumentHandler`最重要的逻辑就是创建了一个重要的handler对象，但是并没有执行这个handler除了构造函数之外的任何方法。这个handler里面的方法要稍等一会才执行，因为它需要先获得到一个关键的参数才能够开始执行。这个关键的参数就是PDF文档的长度。因为PDF阅读器在基于分片加载的情况下，需要加载文档头部和尾部的元数据信息，并且验证他们的完整性和正确性，因此是需要知道PDF文档的长度的，并且是要在最开始的时候就要加载的。PDF文档还会根据文档的长度和分片长度做一些优化。

在准备工作完毕后，MessagerHandler发送了一个Ready信息，这个消息会驱动相关的类向后台请求文档长度：

```js
function getDocument(){
  // ...
  messageHandler.send("Ready", null);
}
```

在收到这个Ready信息后，viewer一路创建并调用对象，直到创建`PDFFetchStreamReader`类型的对象，然后发出第一个获取文档的请求——这个请求会获取文档的最基本信息，即文档长度。在默认的情况下，PDF阅读器希望后台返回两个数据，第一个数据是文档的长度，放在http请求头的头部的ContentLength字段。另一个是整个文档信息，放在请求体即body中，但是这个body有时候会被读取，有时候不被读取直接丢弃。当body大小小于两次分片长度的时候，PDF.js就会读这个body，不然的话PDF.js会直接丢弃这个body。这么做有比较大的弊端，会导致一些计算资源的浪费，而且难以优化。后续的博客，在分片加载那一块中，我们会详细的说明这个问题，而且将这里的实现方式直接改掉。下面是具体请求的代码：

```js
fetch(
  url,
  createFetchOptions(/*...*/)
).then(response => {
  // ...
  const { allowRangeRequests, suggestedLength } =
        validateRangeRequestCapabilities({
          getResponseHeader,
          //  ...
        });
  this._isRangeSupported = allowRangeRequests;
  // Setting right content length.
  this._contentLength = suggestedLength || this._contentLength;
```

获取到文档长度之后，就可以开始进入读取文档的阶段。即上面提到的方法`loadDocument`，分析该方法：

```js
async function loadDocument(recoveryMode) {
  await pdfManager.ensureDoc("checkHeader");
  await pdfManager.ensureDoc("parseStartXRef");
  await pdfManager.ensureDoc("parse", [recoveryMode]);

  await pdfManager.ensureDoc("checkFirstPage", [recoveryMode]);
  await pdfManager.ensureDoc("checkLastPage", [recoveryMode]);

  const isPureXfa = await pdfManager.ensureDoc("isPureXfa");
  // ....
}
```

上述的代码是读取PDF文档二进制数据并解析出文档相关信息的关键。里面的内容是转换二进制的文件流。

上述的代码调的都是一个方法，即`pdfManager.ensureDoc`。不过实际调用的方法却是PDFDocument这个对象的一系列方法。上面的`ensureDoc`的参数如`checkHader`、`parseStartXRef`、`parse`、`checkFirstPage`、`checkLastPage`等，最终会调用`PDFDocument#checkHeader`、`PDFDocument#parseStartXRef`、`PDFDocument#parse`、`PDFDocument#checkFirstPage`、`PDFDocument#checkLastPage`这些方法。`PDFDocument`是core层下的一个重要的对象，可以认为代表了PDF文档（不包括视图那一部分）本身。通过它可以进行一系列的对文档的操作。

这些方法的用处：

- checkHeader：只做了两件事，第一件事是判断PDFHeader是否有头部的魔数（签名），然后查看PDF的版本信息。

  ```
  %PDF-1.7
  %μῦ
  
  1 0 obj
  <</Names<</Dests 4 0 R>>/Outlines 5 0 R/Pages 2 0 R/Type/Catalog>>
  endobj
  
  2 0 obj
  <</Count 1/Kids[6 0 R]/Type/Pages>>
  endobj
  
  3 0 obj
  <</Author(Administrator)/Comments<>/Company<>/CreationDate(D:20240220164528+08'45')/Creator<FEFF00570050005300208868683C>/Keywords<>/ModDate(D:20240220164528+08'45')/Producer<>/SourceModified(D:20240220164528+08'45')/Subject<>/Title<>/Trapped/False>>
  endobj
  
  4 0 obj
  <</Names[]>>
  endobj
  
  5 0 obj
  <<>>
  endobj
  
  6 0 obj
  <</Contents 7 0 R/MediaBox[0 0 841.799936 595.2]/Parent 2 0 R/Resources<</ExtGState<</GS8 8 0 R>>/Font<</FT14 14 0 R/FT9 9 0 R>>>>/Type/Page>>
  endobj
  
  7 0 obj
  <</Filter/FlateDecode/Length 1795>>
  
  ....
  ```

  

  其中`%PDF-`就是签名，`1.5`就是版本号。

- parseStartXRef，将XRef表（交叉引用表）开始偏移的位置找出来。交叉引用表对整个PDF很重要。交叉引用表一般在PDF的尾部。

- PDF的结构比较特殊，开头是一些元信息，结尾则是另外一些信息，而中间的部分才是内容。交叉引用表在PDF中的结构大概如下：

  ```
  xref
  0 24
  0000000000 65536 f 
  0000000017 00000 n 
  0000000100 00000 n 
  0000000152 00000 n 
  0000000419 00000 n 
  0000000448 00000 n 
  0000000469 00000 n 
  0000000628 00000 n 
  0000002492 00000 n 
  0000002558 00000 n 
  0000002687 00000 n 
  0000003686 00000 n 
  0000003859 00000 n 
  0000004148 00000 n 
  0000043159 00000 n 
  0000043290 00000 n 
  0000043626 00000 n 
  0000043808 00000 n 
  0000044100 00000 n 
  0000056430 00000 n 
  0000056576 00000 n 
  0000057803 00000 n 
  0000057949 00000 n 
  0000059310 00000 n 
  
  trailer
  <</Size 24/Info 3 0 R/Root 1 0 R/ID[<0B6164B5495D4A3487C24926C53680D2><5C419581798A47E3AAC0D7F78DE8265D>]>>
  
  startxref
  59380
  %%EOF
  ```

  上面的两个方法，是简单的验证和读取一些信息。
  

- `parse`方法开始真正的处理数据，`parse`方法首先读取并记录了XRef表的信息。在这过程中，PDF还对加密文件做了特殊处理。不过对于PDF.js来说，最重要的还是要读取**PDF的目录**、**页面索引**、**对象索引信息**。因为它们是PDF.js能否支撑对大的PDF文件进行分片加载，即按需加载的关键。PDF的目录内容对我们来说是至关重要的，它记录了每个页的位置基本偏移、引用等关键信息。如果PDF目录结构组织的比较好的话，加载PDF的时候就只需要加载对应页的信息、只加载对应页实际引用的信息，而不需要将不显示的页面信息、未被实际使用的引用对象也加载出来。这样对于几百MB甚至几G的PDF文件都可以实现秒加载。在这个方法中通过分析出来的文档的基本信息，PDF.js构建了一个Catalog对象。不管是在前端用PDF.js还是在后端用PDFBox来处理PDF，还是PDF文件本身，它们都是用Catalog来表示PDF本身的目录信息。如果不想要分片加载，那这里目录组织的方式到底是否良好，就不太重要了。

  

- checkFirstPage方法，此处加载第一页的逻辑，是异步执行的。它创建了一个新的Page对象，这个Page对象在加载过程中未做特殊处理。 在加载了第一页之后，PDF.js又加载了最后一页。

  ```js
  // Check that at least the first page can be successfully loaded,
  // since otherwise the XRef table is definitely not valid.
  // 至少检查一下第一页是否能够成功加载，否则的话XRef表是有问题的。
  await pdfManager.ensureDoc("checkFirstPage", [recoveryMode]);
  
  // Check that the last page can be successfully loaded, to ensure that
  // `numPages` is correct, and fallback to walking the entire /Pages-tree.
  // 确认最后一页也可以被成功加载，这样说明numPages也是对的。
  await pdfManager.ensureDoc("checkLastPage", [recoveryMode]);
  
  ```

  

在上述基本信息搞定了之后，阅读器开始开始正式加载文档。此处的加载文档不同于上面对文档的基本信息进行处理，此处更偏向于对页面的渲染。在这里简单的截取一段代码：

```js
load(pdfDocument) {
  // ...
  const pageLayoutPromise = pdfDocument.getPageLayout().catch(() => {});
  const pageModePromise = pdfDocument.getPageMode().catch(() => {});
  const openActionPromise = pdfDocument.getOpenAction().catch(() => {});
  // ...
  this.toolbar?.setPagesCount(pdfDocument.numPages, false);
  this.secondaryToolbar?.setPagesCount(pdfDocument.numPages);
  // ...
  const pdfViewer = this.pdfViewer;
  /* 不是简单的set，里面包含了大量的逻辑*/
  pdfViewer.setDocument(pdfDocument);
  const { firstPagePromise, onePageRendered, pagesPromise } = pdfViewer;
  // ...
}
```

由于整个`load`函数内部多且庞杂，这里就是大段的处理渲染逻辑的地方。如检查PDF.js是运行在什么平台上、设置页面数量、从第几页开始加载、加载完成之后做一些什么事情等。**对于想要改造PDF.js的开发者而言，如果想要增加或删除一些渲染前后的逻辑，是可以在这里进行改动的。比如希望我们的PDF组件能够根据URL的参数来决定开始的时候直接跳转到第几页。因此在这里增加逻辑。**如果请求阅读器的请求中有`loadPageIndex`参数的时候。我们会按照这个参数跳转到指定的页数。这样阅读器的使用者，在第一次阅读了一部分页面并离开后，第二次再打开阅读器的时候，可以直接调到上次阅读的地方。

`load`里面的函数调用有一个特点，就是基本上使用的都是异步Promise来实现的。因此调试起来，也有一定难度。

`load`里面有一行比较关键的代码——`pdfViewer.setDocument(pdfDocument)`，这个代码里有大量的逻辑。而pdfViewer就是前面提到的一个初始化的对象，他代表了整个PDF阅读器。而这里的代码看似是set对象，实际上里面执行了类似于通过`pdfDocument`来初始化`pdfViewer`对象的逻辑。这里面大量的逻辑也都是对阅读器的展示进行处理的。 下面代码包含了PDFViewer的一个重要逻辑，就是获取第一页。不过是通过异步来获取的：

```js
setDocument(pdfDocument) {
  // ...
  const pagesCount = pdfDocument.numPages;
  const firstPagePromise = pdfDocument.getPage(1);
  // ...
}

```

获取完毕后，根据获取到的信息开始对阅读器进行渲染。获取信息结束后，开始渲染的主要逻辑有接下来这么几段：

```js
setDocument(pdfDocument) {
  // ...
  const pagesCount = pdfDocument.numPages;
  const firstPagePromise = pdfDocument.getPage(1);
  // ...
  Promise.all([firstPagePromise, permissionsPromise])
    .then(([firstPdfPage, permissions]) => {
    // ...
    // 初始化批注管理器 —— 我们能够给PDF.js增加如高亮、文本、绘图等批注都要依赖它
    this.#annotationEditorUIManager = new AnnotationEditorUIManager(/*...*/)
    // ...
    // 根据Viewport设置页面大小
    const viewport = firstPdfPage.getViewport({
      scale: scale * PixelsPerInch.PDF_TO_CSS_UNITS,
    });
    // ...

    // 开始为每一个页面添加一个阅读器对象
    // 每一个PDFPageView代表了每一个页，
    // 给PDFViewer增加这些页对象的时候，这些PDFPageViewer对象本身会创造大量的空白div
    // 给每一个页面作为底的存在
    for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
      const pageView = new PDFPageView({
        container: viewerElement,
        eventBus: this.eventBus,
        id: pageNum,
        // ...
      });
      this._pages.push(pageView);
    }
    // ...
    // 默认加载第一页
    const firstPageView = this._pages[0];
    if (firstPageView) {
      firstPageView.setPdfPage(firstPdfPage);
      // ...
    }
  };
          }

```

上面的代码向用户展示了`pdfViewer.setDocument`过程中做了哪些事。

首先是初始化了`AnnotationEditorUIManager`对象。因为特别关注阅读器对批注的管理，因此`AnnotationEditorUIManager`对象非常重要，在它初始化好了之后，对其进行了一轮改造，赋予其一些新的能力。后续在给PDF.js追加新功能的时候，大量使用和修改了这个对象。

其次是循环创建了一系列的`PDFPageView`对象，这些对象代表了PDF阅读器中的一个个页面。这边对它们只是做了初始化的处理，即创建了一个个空白的div，并没有做渲染处理。

在创建了一系列的`PDFPageView`对象之后，页面获取并初始化了第一个页面。值得注意的是，在后面的逻辑中，可能还会打开别的页。从而将打开第一页这个逻辑给覆盖掉。

在利用`PDFDocuement`初始化结束`pdfViewer`对象之后，阅读器还有一些逻辑要处理，这些逻辑的代码依旧在`load(pdfDocument)`方法中，代码简化后效果如下：

```js
load(pdfDocument) {
  ...
  firstPagePromise.then(pdfPage => {
    ...
    promiseAll.push(pageLayoutPromise, pageModePromise, openActionPromise);
    Promise.all(promiseAll)
      .then(async ([...]) => {
        ...
        // initialBookMark中包含了一些参数
        // 通过修改他来达到页面跳转效果
        const initialBookmark = this.initialBookmark;
        ...
        // 根据信息调整要展示的页面
        // 这个方法里面除了设置一些基本信息外，还会创建canvas，即PDF显示的canvas
        // 渲染完成之后，会将一些基本的视图信息渲染出来
        this.setInitialView(hash, {
          rotation,
          sidebarView,
          scrollMode,
          spreadMode,
        });
        ...
        await Promise.race([
            pagesPromise,
            new Promise(resolve => {
              setTimeout(resolve, FORCE_PAGES_LOADED_TIMEOUT);
            }),
          ]);
        ...
        this.setInitialView(hash);
      }
  }
}
```

核心逻辑还在最后的`Promise.all(...).then()`的方法里面。这里面最重要的方法是`setInitialView`方法。这个方法负责了canvas对象的创建，以及一部分页面的渲染。同样的，他也会管理一些其它和视图相关的内容。

`setInitialView`方法通过多层调用，最后实现了页面的绘制，具体的调用过程如下：

```js
PDFViewerApplication#setInitialView -> PDFLinkService#setHash -> PDFViewer#scrollPageIntoView
-> PDFView#set currentScaleValue -> PDFViewer#setScale -> PDFViewer#setScaleUpdatePages
-> EventBus#dispatch -> #webViewerScaleChanging -> PDFViewer#update
-> PDFRenderingQueue#renderHighestPriority -> PDFViewer#forceRendering
-> PDFRenderingQueue#renderView -> PDFPageView#draw
```

`PDFPageView#draw`，点开这个方法，它在这里创建了一个div类型的dom元素canvasWrapper，并在这个dom元素下又创建了canvas对象，并声明了一个渲染方法：

```js
async draw() {
  ...
  const canvasWrapper = document.createElement("div");
  canvasWrapper.classList.add("canvasWrapper");
  div.append(canvasWrapper);
  ...
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "presentation");
  canvas.hidden = true;
  ...
  canvasWrapper.append(canvas);
  this.canvas = canvas;
  ...
  const renderTask = (this.renderTask = this.pdfPage.render(renderContext));

  renderTask.promise.then(
    async () => {
      showCanvas?.(true);
      await this.#finishRenderTask(renderTask);
      ...
      this.#renderTextLayer();
      await this.#renderAnnotationLayer();
      await this.#renderDrawLayer();
      this.#renderAnnotationEditorLayer();
      ...
    });
}
```

通过这里的代码，可以看到在页面渲染完成之后。PDF.js还会在被渲染的页面对象之上添加多个层级的div。这些层级有绘图层、文本层、批注层等，每一层的用处都是各不相同的。后续涉及到添加批注的时候，还会对PDFPageView的结构还会做进一步的研究，在这里，暂时不过多探讨。主要讲述它在启动过程中的流程。等多层的数据绘制完毕后，阅读器基本上也就加载完了。当然，需要注意的是，PDF.js的阅读器不仅是在这里绘制了不少的东西，在renderTask里面也绘制了很多东西，主要是XObject一类的。其主要代码如下。

首先，renderTask里面在requestAnimationFrame里增加了一段渲染的逻辑，这是它和其它绘制不太相同的地方：

```js
_scheduleNext() {
  if (this._useRequestAnimationFrame) {
    window.requestAnimationFrame(() => {
      this._nextBound().catch(this._cancelBound);
    });
  } else {
    Promise.resolve().then(this._nextBound).catch(this._cancelBound);
  }
}
```

而沿着这个渲染逻辑一直往下探究，可以追溯到`CanvasGraphics#executeOperatorList`。透过这个类和名字，大概可以推断出，这个类主要是负责以绘制Graphics为主。既包括Path这种线段，也包含Image这种对象。以绘制图像为例，可以看到，有下面的这段代码：

```js
paintImageXObject(objId) {
  if (!this.contentVisible) {
    return;
  }
  const imgData = this.getObject(objId);
  if (!imgData) {
    warn("Dependent image isn't ready yet");
    return;
  }

  this.paintInlineImageXObject(imgData);
}
```

至此，PDF.js的阅读器将第一个页面渲染完毕，这同样也代表着整个PDF.js阅读器初始化的逻辑就结束了。下面，做个总结，简单概括一下PDF.js阅读器的启动流程：

1. 首先，和绝大部分程序一样，PDF.js阅读器需要先初始化一些最基础的类，然后从他们开始，一点一点的将程序启动起来。

2. 随后，PDF.js开始加载文档。在开发的过程中，是默认按照远程、分片的形式来进行加载的。最初要获取的是整个文档的长度。有了文档长度之后，PDF.js先读取头部的数据信息，再读取尾部的数据信息。然后利用这些信息PDF文档的Catalog（目录）建立起来。

3. 文档的Catalog加载完毕后，开始获取第1页的数据（或者指定页）。

4. 获取完第1页信息后，根据PDF的页面尺码大小（viewport）、页码数等数据将这个PDF的基本结构创建出来。但是并不渲染，具体的渲染要等到页面被访问的时候。

5. 开始渲染第1页。渲染的时候，主要有几部分。首先是底图，底图我们可以看作是PDF本身，在页面上具体的展示就是一个canvas。然后底图之上又有多个层级，如TextLayer，DrawLayer，AnnotationLayer等，这些层级丰富了PDF阅读器的功能，增加了一些交互。

   



### 实现批注管理以及添加新批注

**改造批注的生命周期，添加API实现对批注的操作**

PDF.js里面批注和页面是紧密结合的。不同的批注类型实现方式不尽相同，且没有直接的API可以操控这些批注。

通常只能通过鼠标的点击操作来增加、删除、修改批注。但是这对于一个业务系统来说是远远不够的，想要的是能够通过API来自由的控制批注的添加、删除、修改、选中、定位等功能，从而实现将PDF.js完美融入到业务系统当中去，而不仅仅是一个单独的PDF展示器。因此需要对PDF.js的批注实现逻辑进行一定的改动。

在修改批注实现逻辑与生命周期之前，需要对批注的实现原理有一个清晰的认识。 首先，需要知道PDF单个页面的html的页面结构。下面是简化后的一个单个页面的组成结构：

```html
<div class="page" data-page-number="1">
  <div class="canvasWrapper">
    <canvas role="presentation"/>
  </div>
  <div class="textLayer"></div>
  <div class="annotationLayer"></div>
  <div class="annotationEditorLayer"></div>
</div>
```

- canvasWrapper是PDF的底图，就是一个canvas。负责展示最原始的PDF数据。而其它几层则分别承担着文字控制、批注展示等功能。

- textLayer代表的是PDF的文字层。因为PDF的底图是一个canvas，而canvas实际上是一层图片，因此即使canvas中有文字也是无法被选中和操作的。但是在PDF中选中文字，是一个再平常不过的功能了。甚至要的也不仅仅是可以选中文字，我们还要能够对选中的文字进行进一步的操作，比如选中、复制、增加删除线、增加下划线等。PDF.js通过在底图canvas上贴一层隐形的文字图层来实现这个功能的。这一层就是textLayer层。在PDF中，文字的位置、大小、字体等这些原始信息，会被记录在PDF文件本身。**当然，有一些PDF会保存，也有一些PDF不保存，如果PDF不保存文字的基本信息的话，那么就不太好用这种方式实现对文字的选中了。**有了这些信息之后，PDF.js就能够知道文档中的每一个字所在的位置。因此，PDF.js在PDF的canvas之上，又增加了一层textLayer层。在textLayer这一层里面，PDF.js增加了大量的span标签，而这些标签的内容就是PDF里的文字。这些标签里文字的位置，和canvas里以图的形式展示的文字的位置，是一模一样的。但是这些标签里的文字却是透明的，但是是可以选中的。这些文字就像贴在canvas文字上的一层膜，虽然看不见，但是可以选中。文字可以选中之后，我们就可以进一步的围绕着文字添加一系列新功能，例如高亮、删除线、下划线等。从用户的视角来看，他们在选中文字的时候，看似是选中了canvas中的文字，实际上选中的是textLayer里面透明的文字。

- annotationLayer层主要是PDF中的annotation，主要是存放一些附加信息、标记或者互动元素的特殊元素或功能。带有跳转功能的目录就是其中一种annotation。这一层更多的是PDF自带的内容，且这种内容一般不属于文本相关的内容，而是作为额外的信息存在。
- annotationEditorLayer层存放的主要内容就是添加的各种各样的批注。批注的种类较多，但是实现的方式各不相同。有的是通过canvas实现，有的是通过div实现。当添加了一些基于canvas实现的批注，这一层就会多出一些canvas元素。如果增加了一些基于div相关的批注，这一层底下就会多出一些div元素。

上面介绍了批注实现原理的dom结构，下面开始介绍**负责操控批注的JS相关的类**，这些类更好的展示了批注的实现逻辑。 首先是整个批注中两个最为关键的类，分别是`AnnotationEditorUIManager`和`AnnotationEditorLayer`。`AnnotationEditorUIManager`是一个全局管理的类。它里面记录了全局批注的情况。`AnnotationEditorLayer`是单个页面的批注的管理。想要改变批注的实现逻辑，就必须要先改写并接管这两个类的控制权。`AnnotationEditorUIManager`在PDF加载的时候就会创建，操作起来较为容易。但是`AnnotationEditorLayer`是懒加载的。因为PDF.js的页面是懒加载的，而PDF的每一页都对应一个`AnnotationEditorLayer`，因此`AnnotationEditorLayer`也是懒加载的，即页面没有渲染的时候，对应页面的`AnnotationEditorLayer`也不存在。

当要向PDF添加一个批注的时候，PDF.js会先创建这个批注的对象，比如创建绘制图像的时候，就会先new一个`InkEditor`，高亮一段文字的时候，就会先new一个`HighlightEditor`。创建完毕后，再将这个批注加入到`AnnotationEditorUIManager`当中去，由`AnnotationEditorUIManager`来进行全局的管理，**而`AnnotationEditorUIManager`最终会将这个批注加入到对应的页面管理对象`AnnotationEditorLayer`中，由`AnnotationEditorLayer`负责来管理各自所对应的页面的批注。**

PDF.js一共自带了四个批注，分别是InkEditor（绘制图形批注）、HighlightEditor（高亮文字批注）、ImageEditor（图片批注）、TextEditor（文字批注）。他们的实现方式各不相同。创建和加入`AnnotationEditorLayer`的时机，也各不相同。因此当需要接管这些批注的时候，就要对其创建、修改、删除等流程有着详细的了解。

首先，阅读器有批注模式和非批注模式，非批注模式下，我们就是纯粹的阅读，不会对文档有任何改变。但是如果想对文档添加某种形式的批注，就要先点击对应的按钮，进入相应的批注模式。同样的，为了方便添加批注，在不同的批注模式下，PDF.js对PDF的文字的选中、点击等功能，有着不同程度的支撑。

下面点击绘制图形批注模式的例子，当点击绘制图像之后，就会执行下面这段代码：

```js
case AnnotationEditorType.INK:
  // 为了方便绘制图形而增加的
  this.addInkEditorIfNeeded(false);
  this.disableTextSelection();
  this.togglePointerEvents(true);
  this.disableClick();
  break;
```

当批注模式切换成INK模式之后，文字选中和点击功能就都不能使用了。但是PDF.js在PDF页面上加了一个画板，让开发者可以在这个画板上自由自地绘制图形。

在了解PDF.js批注实现的基本原理之后，开始实现对批注的管理了。在此，有两个目标需要达成。

- 第一个目标是通过改造PDF.js内部批注实现的方式，能够将一些批注操作暴露出来并封装成API，从而能够通过自己封装的API来控制批注的创建、删除、修改等。
- 第二个目标是在批注的生命周期中加入一些钩子，让这些钩子能够将执行我们的代码。这样的话，批注在进行创建、删除、修改的时候，能够执行我们新加入的代码，告知我们批注发生了什么变化。从而我们能够及时根据用户的操作，来同步修改业务系统中的批注信息。

第一个目标的实现，对于自身有的但没有暴露出来的API，将其暴露出来。对于不够标准的API，将其标准化。对于业务有需求的API，但是批注本身没有的，按照批注的逻辑编写一个API即可。

第二个目标因为批注本身都是用户通过操作页面添加出来的，而且每一个批注的生命周期和创建、修改逻辑都不尽相同，因此没有办法仅通过一种特别的方式或者添加少量代码，就能让所有的批注都能够在它们发生变化的时候及时将信息有效的传达开发者。即需要逐个分析PDF阅读器每一种批注的生命周期，在涉及到添加、修改、删除的时候都要添加上自己定义的钩子。然后再通过这些钩子，将PDF阅读器内部批注的信息传达给外部的操作者和调用者。最终才能够实现对PDF.js里所有的批注的生命周期的监听。也只有这样，当页面上的批注发生变化的时候，我们的业务系统才能够通过监听及时的作出响应，同步通知后端，让后端作出相应的操作。



#### 高亮批注

单从生命周期的角度来看，实现逻辑最为简单的批注就是高亮。高亮批注对应的类是HighlightEditor。在PDF.js中，要想高亮一段文字，需要先进入高亮批注模式。进入高亮批注模式之后，通过选中想要进行高亮的文字，即可实现高亮功能。高亮功能本身不能够修改，也不能够移动，只能够删除和修改颜色，因此高亮模式是最容易处理的。给高亮模式在三个地方添加了钩子。

- 第一个是创建的时候，高亮类型的批注在创建的时候会调用钩子，直接将高亮中的文字、高亮位置、高亮颜色等信息传递给我们，通过它们就可以记录下高亮的主要信息了，并能够通过这些信息在后续的操作中还原高亮批注。

- 第二个是在修改高亮批注颜色的时候，也加入一个钩子，这个钩子会记录高亮批注修改后的信息。

- 第三个则是删除，删除这个地方增加钩子主要是为了让后台能同步删除掉批注，别的逻辑较少。通过上述的操作，就可以实现对高亮进行完全的把控了。

下面展示几段修改的代码：

```js
// 该代码在负责管理每个页面的Editor管理的AnnotationEditorLayer当中
#createNewEditor(params) {
  const editorType = this.#currentEditorType;
  const retVal = editorType
    ? new editorType.prototype.constructor(params)
    : null;
  /** 在此处新增逻辑，editor对象构造完后执行 */
  if (retVal) {
    this.#uiManager.hook.postConstruct(retVal);
  }
  return retVal;
}

...
// 该方法在所有批注的基类Editor当中
remove(forHide = false) {
  // 原删除逻辑
  ...
  // 增加新逻辑，如果删除了对象，需要执行该钩子
  if (!forHide) {
    this._uiManager.hook.postDestory(this);
  }
}

```

因此在默认的生产环境中，该高亮批注是不打开的，手动打开。需要修改的代码是AppOption下的enableHighlightEditor开关：

```js
enableHighlightEditor: {
  // 这个开关是临时的，因为我们加了一些尚在实验的特性在里面。不过这个选项的关闭是暂时的。
  value: typeof PDFJSDev === "undefined" || PDFJSDev.test("TESTING"),
  kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
}
```

当然，PDF的高亮批注的原始信息中并没有记录高亮的文字有哪些。通过追根溯源，找到高亮对象创建前的代码，从document对象上获取到的selection对象，并调用selection.toString()获取到选中的文字，并传给HighlightEditor。通过这种操作，开发者就能获取到用户高亮时的文字了。

下面是简化的代码：

```javascript
pointerUpAfterSelection(event) {
  const selection = document.getSelection();
    ...
  if (boxes.length !== 0) {
    this.#createAndAddNewEditor(event, false, {
      boxes, selectedText: selection.toString()
    });
  }
}
```

当用户在高亮模式下按下左键时，就可以开始选中文字了。当用户松开左键时，就会触发高亮批注的创建，最终就会执行这里代码。即获取选中区域，通过选中区域来构建选中批注。在这里添加代码获取了选中的文本，并传递了下去。最终这些文本会向用户展示，也会记录到数据库当中去，也可能会供数据分析使用。



#### 图片批注

StampEditor。这个批注是负责向PDF中加入图片对象的批注。与上面的高亮批注不同的是，当我们选择图片的时候，批注的管理器会立刻创建一个StampEditor的对象。但是这个对象是空壳子，既没有图片信息，也不包含准确的位置、图片大小、宽高等信息，因此也不是我们想要保存的对象。而上述提到这些关于图像批注所必须要有的信息，会在我们选择完图片，并且图片加载完毕之后，才初始化，才有了真正需要记录的数据。因此这个批注和高亮批注的处理方式会有所不同。在高亮的时候，对象一创建就可以执行我们添加的钩子，但是对于图像批注来说不行。对于图像批注来说，需要在这个图像初始化完毕之后再执行创建钩子。同样的，能找到StampEditor初始化完毕的地方，并在这个地方加入钩子，记录图像的初始信息。通过一番定位，阅读器在初始化完毕之后会执行Resize操作，来完成图像渲染的最后一步。因此在这个地方加入逻辑。具体修改的地方如下：

```js
#createObserver() {
  this.#observer = new ResizeObserver(entries => {
    const rect = entries[0].contentRect;
    if (rect.width && rect.height) {
      this.#setDimensions(rect.width, rect.height);
    }
    // 增加出初始化的逻辑
    if (!this.fromCommand && !this.hasRecord) {
      this.imgBase64 = this.#canvas.toDataURL();
      this._uiManager.hook.postInitialize(this);
      this.hasRecord = true;
    }
  });
  this.#observer.observe(this.div);
}
```



需要注意的地方有几点。第一是因为图片要记录到后台去，但是并不想为图片再做一个对象管理的功能。因此直接将图片转换成base64位存进数据库（需要注意的是，这个文本可能会比较大）。第二是我们的对象初始化的时候，如果是用户手动在UI上点击创建的，需要执行初始化代码。但是如果是我们根据从后台读取的图像信息渲染到用户的界面上的，那么是不需要执行这个代码的。

能对图片批注进行修改的操作，主要有两个，一个是移动位置，一个是修改大小。这两个都是通过的修改操作，因此只要在父类Editor上作统一的修改即可，无需作特别的操作。



#### 文字批注

文字批注也比较特别。选择添加文字批注的模式之后，就可以在页面上添加文字了。当用户在页面上点击的时候，会自动添加一个文本框。这个文本框的出现对应的也是FreeTextEditor的创建。需要注意的是，如果此时在文本框上不输入任何文字，就将焦点移动到其它的元素上的时候，那么这个文本框会自动进行销毁。即AnnotationEditorLayer自动执行这个批注的remove方法。这一点对想要来进行批注的管控不友好，因此将这一段逻辑移除掉。

FreeTextEditor创建的逻辑简单，在对象创建完成后就会立刻完成初始化，不像图片批注，在对象创建完之后还有一段初始化逻辑，只有等初始化逻辑走完之后，对象自身的属性才算是完整。相比其它的批注类型，文本类型的批注可以移动，但无法手动修改文本框的大小。文本类型的批注可以修改文字的内容，因此在文本类型文字内容文字发生变化的时候，我们要执行相应的逻辑。但是又不能在批注每次文字发生变化的时候，都执行变化的逻辑，这样会导致修改的逻辑执行的过于频繁。因此我们只在文本编辑器输入文字结束后，才执行确认修改的逻辑。文本编辑器在输入文字结束后，会执行失焦的代码，即focusout(event)方法，因此我们通过修改这边的逻辑，将自己的钩子加入到文本批注的创建之中。

```js
focusout(event) {
  const editMode = this.isInEditMode();
  const target = event.relatedTarget;
  const targetRight = !target?.closest(`#${this.id}`);
  super.focusout(event);
  if (this._focusEventsAllowed && editMode && targetRight) {
    this._uiManager.hook.postModifyConfirm(this);
  }
}
```

除了修改字体之外，文本还有修改颜色和字体这两种操作。不过这种操作在父类Editor里面有一些公共的逻辑，因此统一处理掉。



#### 自由绘制批注

最后，也是难度最高的，自由绘制的批注，对应的是PDF.js里的InkEditor。在用户选择了绘制模式之后，在所有的AnnotationEditorLayer上都会增加一个画板，供绘制。同样的，也创建一系列与这些画板一一对应的InkEditor对象。如果用户在这些画板上没有执行任何操作，就切换到其它模式去了。那么这些空白的画板也会和文本批注一样被自动删除掉。

因此无法像处理高亮批注一样，直接在创建后就开始执行我们的代码。也需要等InkEditor初始化完毕之后才能执行。**InkEditor需要等到用户绘制完毕并主动失焦后才能完成初始化。**在原始的PDF.js中，用户可以在一次绘制中绘制多条线。这个设计不太符合客户的需求，客户需要用户只要绘制完一条线就要创建一个InkEditor。因此我们对绘制的逻辑做了一定的改动，保证用户在绘制完一条线之后就会生成一个新的InkEditor。InkEditor绘制完毕后，PDF.js还会做一个自适应的操作，将画板的宽高改为适合图形大小的操作。我们在画板的宽高发生变化之后的地方，添加了一段代码。通过这段代码，把我们的逻辑加入到PDF.js绘制线条的逻辑当中去了。

```js
canvasPointerup(event) {
  event.preventDefault();
  this.#endDrawing(event);
  this.focusout(event);
  if (this.drawingIsBegin) {
    this._uiManager.hook.postInitialize(this);
  }
}

```

由上述的代码可知，在线条绘制完毕之后，添加了一个钩子。同样的，这个钩子只针对用户手动添加的曲线，不包含由API生成的曲线。

在上述的四个批注中，添加了一系列的钩子，从而能够在用户操作批注的时候，及时的感知并执行相关的代码。这样用户创建、修改、删除批注的操作会全部调用我们的钩子，然后执行对应的命令——这个命令一般是调用后台接口，将批注信息实时同步到数据库当中去。有了这些数据之后，我们可以利用这些数据，在PDF展示的时候，同步将批注渲染出来。这样就实现了对PDF批注的完全控制。除此之外，我们还为批注特地开发了一批功能，**主要包括展示、隐藏、跳转、选中四个功能**。通过这四个功能，开发人员可以更好地控制PDF阅读器上的批注。展示、隐藏、选中都是调用PDF.js自带的API实现的。跳转是通过计算PDF页面所在的位置、批注在PDF页面上的位置、批注的高度这三者得出来的，最后滚动至相应的位置来实现的。

在处理前面的批注的时候，加了大量的钩子，那么钩子是在什么时候初始化的？在AnnotationUIManager创建结束的时候，通过EventBus添加一段新的逻辑，这一段逻辑能够将我们的钩子加入到AnnotationUIManager里面去了。下面是具体的代码：

```javascript
// 这个命令在AnnotationEditorManager对象初始化结束后创建
getEventBus().on("annotationeditoruimanager", ()=>{
  const properties = getApplication().pdfViewer._layerProperties;
  const manager = properties.annotationEditorUIManager;

  // 增加四段逻辑，分别在批注构造函数执行完、初始化完、修改后、删除后执行
  manager.hook.postConstruct = postConstruct;
  manager.hook.postModifyConfirm = postModifyConfirm;
  manager.hook.postDestory = postDestory;
  manager.hook.postInitialize = postInitialize;

  const params = window.initPdfDocumentAnnos();
  // 保存到editorManager里面去
  editorManager.initEditorParameters(params, manager);
  controller.renderPreparedLayerAnnotations(editorManager.map);
});

```

总结一下，实现对批注的完全控制的方法。首先研究了批注每个批注的生命周期，并在批注创建、初始化、修改、删除这些比较关键的节点上增加了钩子，将实现将自己的代码植入到批注处理逻辑去。钩子除了要在对应的生命周期点通知后台之外，还要收集好每一个批注的参数，有了这些批注参数之后，我们就可以在下次打开PDF的时候，自动渲染这些批注并展示在页面上了。除此之外，还可以通过批注本身的API来控制这些批注，展示、选中、隐藏或跳转到他们。同时要注意的是，直接使用我们收集的参数来创建批注对象，相较于用户手动绘制，还是有一定区别的。因此我们在批注的初始化逻辑上做了一些兼容性的改动。这些改动不多也不复杂。



#### 新增批注类型

四个批注新增，分别是框选BoxCheckEditor、下划线UnderlineEditor、删除线StrikethroughEditor和箭头ArrowEditor。框选的实现方式不同于上面所有的Editor，下划线和删除线的实现方式和高亮的实现方式类似，而箭头ArrowEditor的实现方式则是和绘制批注InkEditor有一定的相似之处。

因为需要实现自定义的批注，因此理解整个批注的处理逻辑非常重要。在前面的分析中，已经分析了不少关于批注流程相关的内容以及具体每个批注实现的原理了。接下来将对批注的处理流程进行更深一步的分析。想要向PDF添加某种类型的批注，需要先将模式切换到希望添加的批注的模式上去。即点击右上角的对应的批注类型的按钮。

点击按钮之后，PDF.js会调用切换模式的代码。具体的代码简化后如下：

```javascript
updateMode(mode = this.#uiManager.getMode()) {
  this.#cleanup();
  switch (mode) {
    case AnnotationEditorType.NONE:
      this.disableTextSelection();
      this.togglePointerEvents(true);
      this.disableClick();
      break;
    case AnnotationEditorType.INK:
      // We always want to have an ink editor ready to draw in.
      this.addInkEditorIfNeeded(false);
      this.disableTextSelection();
      this.togglePointerEvents(true);
      this.disableClick();
      break;
    case AnnotationEditorType.HIGHLIGHT:
      this.enableTextSelection();
      this.togglePointerEvents(false);
      this.disableClick();
      break;
    default:
      this.disableTextSelection();
      this.togglePointerEvents(true);
      this.enableClick();
  }
  ...
}
```

这一段的切换模式的代码相对来说是比较重要的，切换到不同模式，就可以选择不同类型的操作。有的模式可以点击的时候，就能触发点击相关的事件。有的模式可以选择文字，在文字选择结束后，就可以触发批注的创建。

在这里，深入分析一下`enableClick()`方法。通过分析这个方法，能够知道批注到底是怎么加上去的。下面是`enableClick()`的代码：

```javascript
// 处理 鼠标按下和升起的事件的
enableClick() {
  this.div.addEventListener("pointerdown", this.#boundPointerdown);
  this.div.addEventListener("pointermove", this.#boundPointerMove);
  this.div.addEventListener("pointerleave", this.#boundPointerLeave);
  this.div.addEventListener("pointerup", this.#boundPointerup);
}
```

代码本身比较简单，就是给PDF页对应的div增加四个监听器。分别处理指针按下、松开、移动和离开区域这四种事件。当阅读器所在的模式不相同情况下，这四个监听器执行的代码也不尽相同。其中为`pointerleave`事件添加的监听器，不是PDF阅读器自带的，而是我们新添加进去的。这是为了让框选批注的效果能够更好一些。 除了`enableClick()`，还需要注意一下InkEditor上有一段特别的代码：

```js
this.addInkEditorIfNeeded(false);
```

这和前面提到的，绘制图形批注时做的特殊处理有关。当用户选择绘制图形的时候，PDF.js会给每一个页面，加上一个画板。然后让用户在这个画板上绘制图形。

在处理完切换完模式相关的逻辑之后，开始处理添加批注相关的逻辑。

**框选**

首先是框选批注，框选的批注实现方式简单。当用户选中一段区域的时候，我们只需要将这段区域的位置，即x、y的值，和框选范围的宽高记录下来，就能得到得到一个框选批注了。具体的实现分三步走：

1. 用户选择框选按钮，进入框选模式，PDF阅读器切换模式并添加点击事件。
2. 用户点击页面开始框选，鼠标按下的时候创建框选批注BoxCheckEditor，创建一个具有一定透明度代表框选的div。
3. 用户移动鼠标的时候，框选的范围（即div的大小）跟着用户的鼠标的变化而变化。
4. 用户松开鼠标的时候，框选完成。框选对象也跟着初始化完成。

通过这种方式，框选功能就实现了。框选完成后，还可以拉伸和移动。这样，一个完整的框选功能就开发完了。其主要的逻辑涉及到两部分，一部分是新创建了一个BoxCheckEditor类，继承AnnotationEditor类。另一方面在AnnotationEditorLayer这个管理批注的类上将一些兼容性的功能加上去。这就是添加一个完整的框选功能的实现方式。



**下划线与删除线**

它们看似是两个批注，实际上都是做一样的活儿，都是在做对选中文字进行画线这件事。只不过他们画的线一个实在文字的中间，一个实在文字的底部，实际并无太大区别。

实现删除线和下划线这两个批注，参考的是高亮批注。删除线和下划线在流程上和高亮是差不多的，有区别的地方是在删除线内部的实现上。高亮内部的实现相对是较为麻烦的。当我们在高亮模式下选中一部分文字之后，然后对这些文字进行高亮操作。从PDF阅读器的角度来看，其实非常简单。PDF阅读器首先通过`document.getSelection()`这个方法获取到选中的文字框选范围和文字本身，然后把这个信息丢给HighlightEditor就完事了。剩下的逻辑全部都在HighlightEditor里面。

HighlightEditor拿到的最为有效的信息，就是文字框选的范围。文字框选范围由一堆box组成，每一个box都是一个长方形。这些box可能是完全分离的，也可能是有部分重合的，也有可能一个box正好被另一个box完全覆盖住。因此HighlightEditor需要通过一个算法，来计算这些box组成了几个连在一起的区域。然后要计算出每一个区域的外边框轮廓，并且还要用svg将这些外边框的轮廓表示出来。除此之外，HighlightEditor还需要根据这些box的位置和大小，创建一个div，并保证这个div能够正正好的将所有的由box组成的区域全部包在一起。但是这样还不够，还有一个重要的目标没有达到。虽然创建了一个能够将所有box都包住的div，但是这个div里面只有box所在区域要被染色，可以被选中。因此需要用div的**clip-path**在div里面框选一部分区域，让这部分区域的颜色有所变化，从而达成这部分区域高亮的特效。除此之外，还要保证整个div并不是完全可以被选中的，只有div里面被框选的区域可以被选择，而未被框选的区域不可以被选中。HighlightEditor通过算法，根据一个或多个box计算出一个或多个区域，然后将这些区域的形状通过svg来表达出来。最后在div中引用svg，表示只有被svg包裹住的区域才能够有颜色改变和进行选中。这样一个完整的高亮功能就被实现了。

高亮批注中的clip-path、计算box组成的区域、转换svg等成分，在实现下划线和删除线的过程中，也都是我们需要的。首先从操作流程和接收到的参数这两点上，下划线、删除线和高亮面临的情况是一模一样的。不过高亮批注里面的处理的逻辑相较于下划线和删除线更为复杂一些。当我们拿到文字选中范围的一组box的时候，并不需要像高亮那样复杂的逻辑，我们只需要对这些box进行一系列的过滤，保留有效的框子即可。同一段文字，在被框选中的时候，可能会出现多个重复的box，因此我们需要对box进行去重。在多个重复box中，只保留一个。经过一轮过滤后，只剩下有效的box了。然后开始绘制svg，在每个box的中间都通过svg子标签path来绘制一条直线，就达成了删除线的效果了。在每个box的底部都绘制一条直线，就达成了下划线的效果了。对box的处理是高亮、删除线、下划线有比较大的区别的地方。其它的地方区别倒不是特别大。在处理完box之后，下划线、删除线后续的逻辑和高亮效果还是差不多的。要先计算出一个可以包裹所有的区域的div。然后要计算这些box组成区域的外边框，最后通过这个外边框框起来的区域限制div只能在一部分区域内进行点击、选中，其余部分不可以点击选中。 至此，删除线和下划线的实现也就基本完成了。本身要修改的代码并不多，但是要理解高亮的实现原理还是难度比较大的。



**箭头**

第一个方案是通过加入图像箭头来实现，这个方式不好，因为没办法实现箭头大小不动，而箭柄可以任意变长变短，其次操作起来不方便。第二次是用过div来实现，这个方法也不合适，当用户在一个点点击开始绘制箭头之后，它可能会向四面八方绘制箭头，这个时候div的处理就不太好办了。最后还是决定通过canvas来实现，效果最佳。而且也可以模仿绘制批注来简化开发。和绘制批注一样，当用户点击绘制模式的时候，PDF阅读器会在所有已经加载的页面上面增加一层画板供用户去绘制图形。因此我们也可以这么干，当用户切换到绘制箭头的模式的时候，我们也给所有已经加载的页面增加一层画板，供用户去绘制图形：

```javascript
case AnnotationEditorType.ARROW:
  // 当切换到箭头模式的时候，给页面增加画板
  this.addArrowEditorIfNeeded(false);
  this.disableTextSelection();
  this.togglePointerEvents(true);
  this.disableClick();
  break;
```

有了画板以后就好办了，当用户开始点击的时候，就开始绘制，每当用户移动鼠标的时候，箭头就跟着鼠标移动。用户移动到哪里，箭头就移动到哪里。而箭头本身的三角形的倾斜角度会实时计算出来并做一定旋转。当用户松开鼠标或者鼠标移动到页面外面去的时候图形的绘制就结束了。此时我们的得到的就是一个用户绘制出来的，有效的箭头。绘制完毕之后，我们还需要做一些后置处理。首先就是根据用户绘制的区域将画板缩小到只能包住整个箭头为止（即箭柄和箭的头部这两个区域），然后再添加一个新的画板让用户继续去绘制。通过这几步操作，我们就可以完整的实现一个箭头功能。箭头本身可以移动、可以放缩。

通过以上的操作，又向阅读器添加了四种类型的批注，进一步丰富了PDF阅读器的批注功能。







