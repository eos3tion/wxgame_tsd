declare namespace wx {

    interface Callback {
        /**
         * 	接口调用成功的回调函数
         */
        success?: Function;
        /**
         * 接口调用失败的回调函数
         */
        fail?: Function;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: Function;
    }

    const enum Platform {
        Android = "android",
        DevTools = "devtools",
        IOS = "ios"
    }


    /**
     * 位置样式
     */
    interface PositionStyle {
        left?: number;
        top?: number;
    }

    /**
     * 大小样式
     */
    interface SizeStyle {
        width?: number;
        height?: number;
    }

    /**
     * 矩形样式
     */
    interface RectanbleStyle extends PositionStyle, SizeStyle { }

    interface SystemInfo {
        /**
         * 手机品牌  
         * @version >= 1.5.0
         */
        brand: string;


        /**
         * 手机型号  
         * 
         */
        model: string;


        /**
         * 设备像素比  
         * 
         */
        pixelRatio: number;


        /**
         * 屏幕宽度  
         * @version >= 1.1.0
         */
        screenWidth: number;


        /**
         * 屏幕高度  
         * @version >= 1.1.0
         */
        screenHeight: number;


        /**
         * 可使用窗口宽度  
         * 
         */
        windowWidth: number;


        /**
         * 可使用窗口高度  
         * 
         */
        windowHeight: number;

        /**
         * 状态栏的高度
         * @version >= 1.9.0
         */
        statusBarHeight: number;

        /**
         * 微信设置的语言  
         * 
         */
        language: string;


        /**
         * 微信版本号  
         * 
         */
        version: string;


        /**
         * 操作系统版本  
         * 
         */
        system: string;


        /**
         * 客户端平台  
         * 
         */
        platform: Platform;


        /**
         * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。  
         * @version >= 1.5.0
         */
        fontSizeSetting: number;


        /**
         * 客户端基础库版本  
         * @version >= 1.1.0
         */
        SDKVersion: string;


        /**
         * 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)  
         * @version >= 1.8.0
         */
        benchmarkLevel: number;
    }

    interface GetSystemInfoCallback extends Callback {
        /**
         * 接口调用成功的回调函数
         *
         * @param {SystemInfo} sysInfo
         */
        success(sysInfo: SystemInfo);
    }

    /**
     * 获取系统信息
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getSystemInfo.html
     * 
     * @param {GetSystemInfoCallback} callback
     */
    function getSystemInfo(callback: GetSystemInfoCallback)

    /**
     * wx.getSystemInfo 的同步版本
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getSystemInfoSync.html
     * 
     * @returns {SystemInfo}
     */
    function getSystemInfoSync(): SystemInfo;

    //----------------------------------------------登录 --------------------------------------------------------------

    /**
     * 检查登录态是否过期。  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.checkSession.html  
        通过 `wx.login` 接口获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。开发者只需要调用 wx.checkSession 接口检测当前用户登录态是否有效。

        登录态过期后开发者可以再调用 wx.login 获取新的用户登录态。调用成功说明当前 session_key 未过期，调用失败说明 session_key 已过期。更多使用方法详见 [小程序登录](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/login.html)。
     * 
     * @param param 
     * 
     * @example
     * wx.checkSession({
        success() {
          // session_key 未过期，并且在本生命周期一直有效
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() // 重新登录
        }
      })
     * 
     */
    function checkSession(param: Callback);

    /**
     * 登录回调函数
     */
    interface LoginParam extends Callback {

        /**
         * 超时时间，单位ms
         * @version >1.9.90
         */
        timeout?: number;
        /**
         * 
         * @param res 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 [code2Session](https://developers.weixin.qq.com/minigame/dev/api/code2Session.html)，使用 `code` 换取 openid 和 session_key 等信息
         */
        success?(res: { code: string });
    }

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/wx.login.html
     * 
     * 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。更多使用方法详见 [小程序登录](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/login.html)。
     * @param param 
     * 
     * @example
     * wx.login({
     *    success(res) {
     *    if (res.code) {
     *      // 发起网络请求
     *      wx.request({
     *        url: 'https://test.com/onLogin',
     *        data: {
     *          code: res.code
     *        }
     *      })
     *    } else {
     *      console.log('登录失败！' + res.errMsg)
     *    }
     *  }
     * })
     */
    function login(param: LoginParam);

    //--------------------------------------------网络----------------------------------------------
    //-------------------------------------------发起请求-------------------------------------------

    interface RequestTaskOnHeadersReceivedCallback {
        /**
         * 开发者服务器返回的 HTTP Response Header
         */
        (header: { [key: string]: string })
    }
    /**
     * 网络请求任务对象
     * @version >1.4.0
     */
    interface RequestTask {
        /**
         * 中断请求任务
         */
        abort();

        /**
         * 监听 HTTP Response Header 事件。会比请求完成事件更早
         * 
         * @version >2.1.0 
         * 
         * @param callback 事件的回调函数
         * 
         */
        onHeadersReceived(callback: RequestTaskOnHeadersReceivedCallback);

        /**
         * 取消监听 HTTP Response Header 事件
         * @version >2.1.0 
         * 
         * @param callback
         */
        offHeadersReceived(callback: RequestTaskOnHeadersReceivedCallback);
    }

    const enum RequestMethod {
        /**
         * HTTP 请求 OPTIONS
         */
        OPTIONS = "OPTIONS",
        /**
         * HTTP 请求 GET
         */
        GET = "GET",
        /**
         * HTTP 请求 HEAD
         */
        HEAD = "HEAD",
        /**
         * HTTP 请求 POST
         */
        POST = "POST",
        /**
         * HTTP 请求 PUT
         */
        PUT = "PUT",
        /**
         * HTTP 请求 DELETE
         */
        DELETE = "DELETE",
        /**
         * HTTP 请求 TRACE
         */
        TRACE = "TRACE",
        /**
         * HTTP 请求 CONNECT
         */
        CONNECT = "CONNECT",

    }

    const enum RequestResponseType {
        /**
         * 响应的数据为文本
         */
        Text = "text",
        /**
         * 响应的数据为 ArrayBuffer
         */
        ArrayBuffer = "arraybuffer",

    }

    interface RequestSuccessRtn {
        /**
         * 开发者服务器返回的数据
         */
        data: string | any | ArrayBuffer;
        /**
         * 开发者服务器返回的 HTTP 状态码
         */
        statusCode: number;
        /**
         * 开发者服务器返回的 HTTP Response Header
         */
        header: { [header: string]: string };

    }


    interface RequestParam extends Callback {
        /**
         * 开发者服务器接口地址
         */
        url: string;
        /**
         * 请求的参数 data 参数说明
         * 
         * 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：

         * * 对于 GET 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
         * * 对于 POST 方法且 header['content-type'] 为 application/json 的数据，会对数据进行 JSON 序列化
         * * 对于 POST 方法且 header['content-type'] 为 application/x-www-form-urlencoded 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
         */
        data?: string | any | ArrayBuffer;

        /**
         * 设置请求的 header，header 中不能设置 Referer。 
         * `content-type` 默认为 `application/json`	
         */
        header?: { [header: string]: string };

        /**
         * HTTP 请求方法  
         * 默认为`GET`
         */
        method?: RequestMethod;
        /**
         * 返回的数据格式  
         * 默认为`json`
         * 
         * | 值  |	说明 |
         * | --  | -- |
         * |json |	返回的数据为 JSON，返回后会对返回的数据进行一次 `JSON.parse`|
         * |其他  |	不对返回的内容进行 JSON.parse|
         */
        dataType?: string;
        /**
         * 响应的数据类型  
         * 默认为`text`
         */
        responseType?: RequestResponseType;

        /**
         * 接口调用成功的回调函数
         * @param rtn 
         */
        success?(rtn: RequestSuccessRtn);
    }

    /**
     * 发起 HTTPS 网络请求。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/minigame/dev/tutorial/ability/network.html)。
     * 
     * https://developers.weixin.qq.com/minigame/dev/api/wx.request.html
     * 
     * @example 
     * wx.request({
     *   url: 'test.php', // 仅为示例，并非真实的接口地址
     *  data: {
     *    x: '',
     *    y: ''
     *  },
     *  header: {
     *    'content-type': 'application/json' // 默认值
     *  },
     *  success(res) {
     *    console.log(res.data)
     *  }
     * })
     */
    function request(param: RequestParam): RequestTask;

    //------------------------------------------------米大师充值--------------------------------------------------------

    /**
     * 米大师支付环境
     *
     * @enum {number}
     */
    const enum MidasPaymentEnv {
        /**
         * 正式环境
         */
        Release = 0,
        /**
         * 沙箱环境
         */
        Sandbox = 1
    }

    /**
     * 米大师支付币种常量
     *
     * @enum {number}
     */
    const enum MidasCurrencyType {
        /**
         * 人民币
         */
        CNY = "CNY",
    }

    /**
     * 米大师可用支付金额
     * [buyQuantity 限制说明](https://developers.weixin.qq.com/minigame/dev/document/midas-payment/wx.requestMidasPayment.html#buyquantity-%E9%99%90%E5%88%B6%E8%AF%B4%E6%98%8E)
     *
     * @
     * @enum {number}
     */
    const enum MidasBuyQuantity {
        CNY_1 = 1,
        CNY_3 = 3,
        CNY_6 = 6,
        CNY_8 = 8,
        CNY_12 = 12,
        CNY_18 = 18,
        CNY_25 = 25,
        CNY_30 = 30,
        CNY_40 = 40,
        CNY_45 = 45,
        CNY_50 = 50,
        CNY_60 = 60,
        CNY_68 = 68,
        CNY_73 = 73,
        CNY_78 = 78,
        CNY_88 = 88,
        CNY_98 = 98,
        CNY_108 = 108,
        CNY_118 = 118,
        CNY_128 = 128,
        CNY_148 = 148,
        CNY_168 = 168,
        CNY_188 = 188,
        CNY_198 = 198,
        CNY_328 = 328,
        CNY_648 = 648,
        CNY_Max = CNY_648
    }

    const enum MidasPayFailErrCode {
        /**
         * 系统失败
         */
        Fail = -1,
        /**
         * 支付取消
         */
        Cancel = -2,
        /**
         * 虚拟支付接口错误码，缺少参数
         */
        ArgumentMiss = -15001,
        /**
         * 虚拟支付接口错误码，参数不合法
         */
        ArgumentIllegal = -15002,
        /**
         * 虚拟支付接口错误码，订单重复
         */
        DuplicateOrder = -15003,
        /**
         * 虚拟支付接口错误码，后台错误
         */
        ServerError = -15004,
        /**
         * 虚拟支付接口错误码，appId 权限被封禁
         */
        Banned = -15006,
        /**
         * 虚拟支付接口错误码，货币类型不支持
         */
        UnsupportCurrencyType = -15006,
        /**
         * 虚拟支付接口错误码，订单已支付
         */
        PayedOrder = -15007,
        /**
         * 虚拟支付接口错误码，用户取消支付
         */
        UserCancel = 1,
        /**
         * 虚拟支付接口错误码，客户端错误, 判断到小程序在用户处于支付中时,又发起了一笔支付请求
         */
        ClientError = 2,
        /**
         * 虚拟支付接口错误码，Android 独有错误：用户使用 Google Play 支付，而手机未安装 Google Play
         */
        NoGooglePlay = 3,
        /**
         * 虚拟支付接口错误码，用户操作系统支付状态异常
         */
        SystemPaymentError = 4,
        /**
         * 虚拟支付接口错误码，操作系统错误
         */
        SystemError = 5,
        /**
         * 虚拟支付接口错误码，其他错误
         */
        OtherError = 6,
        /**
         * 参数错误
         */
        ArgumentError = 1000,
        /**
         * 米大师 Portal 错误
         */
        MidasPortalError = 1003
    }

    /**
     * 米大师支付参数
     */
    interface MidasPaymentParam extends Callback {
        /**
         * 支付的类型，不同的支付类型有各自额外要传的附加参数。  
         * 
         * 合法值
         * `game` 购买游戏币
         *
         * @type {"game"}
         * @memberof MidasPaymentParam
         */
        mode: "game";
        /**
         * 环境配置  
         * 默认值: 0
         *
         * @type {MidasPaymentEnv}
         * @memberof MidasPaymentParam
         */
        env?: MidasPaymentEnv;

        /**
         * 	币种
         *
         * @type {MidasCurrencyType}
         * @memberof MidasPaymentParam
         */
        currencyType: MidasCurrencyType;

        /**
         * 在米大师侧申请的应用 id
         *
         * @type {string}
         * @memberof MidasPaymentParam
         */
        offerId: string;

        /**
         * 米大师支付平台  
         * 目前微信小游戏只支持`android`支付
         */
        platform: "android";

        /**
         * 购买数量。mode=game 时必填。购买数量。详见 
         * [buyQuantity 限制说明](https://developers.weixin.qq.com/minigame/dev/document/midas-payment/wx.requestMidasPayment.html#buyquantity-%E9%99%90%E5%88%B6%E8%AF%B4%E6%98%8E)
         * @type {MidasBuyQuantity}
         * @memberof MidasPaymentParam
         */
        buyQuantity: MidasBuyQuantity;

        /**
         * 分区 ID
         */
        zoneId: string;

        /**
         * 充值失败的回调函数
         */
        fail?: { (param: { errMsg: string, errCode: number }) };
    }

    function requestMidasPayment(param: MidasPaymentParam);

    interface GetShareInfoSuccessRtn {
        /**
         * 错误信息	  
         */
        errMsg: string;
        /**
         * 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/signature.html)	  
         * 
         * 示例代码
         * encryptedData 解密后为以下 json 结构，详见[加密数据解密算法](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/signature.html)。其中 openGId 为当前群的唯一标识
         * ```json
          {
            "openGId": "OPENGID"
          }
          ```
         *  **Tips** 
         * * 如需要展示群名称，可以使用开放数据组件
         */
        encryptedData: string;
        /**
         * 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/signature.html)	    
         */
        iv: string;

    }

    interface GetShareInfoParam extends Callback {
        /**
         * shareTicket	  
         */
        shareTicket: string;
        /**
         * 	超时时间，单位 ms  
         * @version >=1.9.90
         */
        timeout?: number;

        /**
         * 
         * @param res 接口调用成功的回调函数
         */
        success(res: GetShareInfoSuccessRtn);
    }

    /**
     * 获取转发详细信息  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getShareInfo.html
     * @param param 
     */
    function getShareInfo(param: GetShareInfoParam);

    /**
     * 隐藏转发按钮  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.hideShareMenu.html
     * @param callback 
     */
    function hideShareMenu(callback: Callback);


    interface ShareAppMessageParam {
        /**
         * 转发标题，不传则默认使用当前小游戏的昵称。
         *
         * @type {string}
         * @memberof ShareAppMessageParam
         */
        title?: string;
        /**
         * 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
         *
         * @type {string}
         * @memberof ShareAppMessageParam
         */
        imageUrl?: string;
        /**
         * 查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
         *
         * @type {string}
         * @memberof ShareAppMessageParam
         */
        query?: string;
    }

    interface ShowShareMenuParam extends Callback {
        /**
         * 是否使用带 shareTicket 的转发详情
         *
         * @type {boolean}
         * @memberof ShowShareMenuParam
         */
        withShareTicket: boolean;
    }

    /**
     * 显示当前页面的转发按钮
     * https://developers.weixin.qq.com/minigame/dev/api/wx.showShareMenu.html  
     * 
     * @example
     * wx.showShareMenu({
        withShareTicket: true
       })
     * 
     */
    function showShareMenu(param?: ShowShareMenuParam);

    /**
     * 监听用户点击右上角菜单的“转发”按钮时触发的事件
     * https://developers.weixin.qq.com/minigame/dev/api/wx.onShareAppMessage.html
     * 
     * @param {(param: {}) => ShareAppMessageParam} callback
     */
    function onShareAppMessage(callback: (param: {}) => ShareAppMessageParam);

    /**
     * 取消监听用户点击右上角菜单的“转发”按钮时触发的事件  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.offShareAppMessage.html
     * 
     * @param {({})} callback
     */
    function offShareAppMessage(callback?: ({}));

    /**
     * 主动拉起转发，进入选择通讯录界面。
     * https://developers.weixin.qq.com/minigame/dev/api/wx.shareAppMessage.html
     * 
     * @param {ShareAppMessageParam} param
     */
    function shareAppMessage(param: ShareAppMessageParam);

    interface UpdateShareMenuParam extends Callback {
        /**
         * 是否使用带 shareTicket 的转发详情  
         * 默认值：false  
         * 
         */
        withShareTicket?: boolean;
        /**
         * 是否是动态消息，详见动态消息  
         * 默认值：false  
         * @version >=2.4.0
         */
        isUpdatableMessage?: boolean;
        /**
         * 动态消息的 activityId。通过 createActivityId 接口获取  
         * @version >=2.4.0
         */
        activityId?: string;
        /**
         * 动态消息的模板信息  
         * @version >=2.4.0
         */
        templateInfo?: TemplateInfo;
    }

    interface TemplateInfo {
        /**
         * 参数列表
         */
        parameterList: Param[];
    }

    interface Param {
        /**
         * 参数名  
         */
        name: string;
        /**
         * 参数值  
         */
        value: string;

    }

    /**
     * 更新转发属性
     * https://developers.weixin.qq.com/minigame/dev/api/wx.updateShareMenu.html
     * @param param 
     * 
     * @example
     * wx.updateShareMenu({
        withShareTicket: true,
        success() { }
       })
     */
    function updateShareMenu(param: UpdateShareMenuParam);

    /**
     * UpdateManager 对象，用来管理更新，可通过 wx.getUpdateManager 接口获取实例。 
     * https://developers.weixin.qq.com/minigame/dev/api/UpdateManager.html
     * 
     * **注： 检查更新操作由微信在小程序冷启动时自动触发，不需由开发者主动触发，开发者只需监听检查结果即可。**
     * 
     * @example
     * const updateManager = wx.getUpdateManager()
     * 
     * updateManager.onCheckForUpdate(function (res) {
     *      // 请求完新版本信息的回调
     *      console.log(res.hasUpdate)
     * })
     * 
     * updateManager.onUpdateReady(function () {
     *      wx.showModal({
     *          title: '更新提示',
     *          content: '新版本已经准备好，是否重启应用？',
     *          success: function (res) {
     *              if (res.confirm) {
     *                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
     *                  updateManager.applyUpdate()
     *              }
     *          }
     *      })
     * })
     * 
     * updateManager.onUpdateFailed(function () {
     * // 新的版本下载失败
     * })
     *
     * @interface UpdateManager
     */
    interface UpdateManager {

        /**
         * 监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。  
         * https://developers.weixin.qq.com/minigame/dev/api/UpdateManager.onCheckForUpdate.html
         *
         * @param {{ (hasUpdate: boolean) }} callback 向微信后台请求检查更新结果事件的回调函数
         * @memberof UpdateManager
         */
        onCheckForUpdate(callback: { (hasUpdate: boolean) });

        /**
         * 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
         * https://developers.weixin.qq.com/minigame/dev/api/UpdateManager.onUpdateReady.html
         *
         * @param {{ () }} callback 小程序有版本更新事件的回调函数
         * @memberof UpdateManager
         */
        onUpdateReady(callback: { () });

        /**
         * 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调  
         * https://developers.weixin.qq.com/minigame/dev/api/UpdateManager.onUpdateFailed.html
         *
         * @param {{ () }} callback 小程序更新失败事件的回调函数
         * @memberof UpdateManager
         */
        onUpdateFailed(callback: { () });

        /**
         * 强制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 `onUpdateReady` 回调）调用。
         * https://developers.weixin.qq.com/minigame/dev/api/UpdateManager.applyUpdate.html  
         *
         * @memberof UpdateManager
         */
        applyUpdate();
    }

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getUpdateManager.html
     * 获取更新管理器对象
     *
     * @version >1.9.90 低版本需做[兼容处理](https://developers.weixin.qq.com/minigame/dev/framework/compatibility.html)。
     * @returns {UpdateManager}
     */
    function getUpdateManager(): UpdateManager;


    /**
     * 打开小程序的参数
     */
    interface NavigateToMiniProgramParam extends Callback {
        /**
         * 要打开的小程序 appId
         */
        appId: string;
        /**
         * 打开的页面路径，如果为空则打开首页
         */
        path: string;

        /**
         * 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
         */
        extraData?: object;
        /**
         * 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
         * 默认值： release
         */
        envVersion?: NavigateToMiniProgramEnvVersion;
    }

    /**
     * 环境
     */
    const enum NavigateToMiniProgramEnvVersion {
        /**
         * 正式版
         */
        Release = "release",
        /**
         * 体验版
         */
        Trial = "trial",
        /**
         * 开发版
         */
        Develop = "develop"
    }

    /**
     * 小程序跳转  
     * https://developers.weixin.qq.com/minigame/dev/document/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html  
     * 
     * 打开同一公众号下关联的另一个小程序（注：必须是同一公众号下，而非同个 open 账号下）。要求在用户发生过至少一次 touch 事件后才能调用。
     * @param {NavigateToMiniProgramParam} param 
     */
    function navigateToMiniProgram(param: NavigateToMiniProgramParam);

    /**
     * 创建激励视频广告组件。
     * https://developers.weixin.qq.com/minigame/dev/document/ad/wx.createRewardedVideoAd.html
     * 
     * 支持版本 >= 2.0.4
     *
     * 请通过 `wx.getSystemInfoSync()` 返回对象的 SDKVersion 判断基础库版本号  >= 2.0.4 后再使用该 API。同时，开发者工具上暂不支持调试该 API，请直接在真机上进行调试。
     *
     * @
     * @param {{ adUnitId: string }} param 广告单元 id   `对应微信公众平台管理页面中`-`流量主`页签
     */
    function createRewardedVideoAd(param: { adUnitId: string }): RewardedVideoAd;


    /**
     * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.onError.html
     * 
     * 视频激励广告的错误码
     * @
     * @enum {number}
     */
    const enum RewardedVideoAdErrorCode {
        /**
         * **异常情况**:后端错误调用失败  
         * **理由**:该项错误不是开发者的异常情况  
         * **解决方案**:一般情况下忽略一段时间即可恢复。  
         */
        Code_1000 = 1000,
        /**
         * **异常情况**:参数错误  
         * **理由**:使用方法错误  
         * **解决方案**:可以前往developers.weixin.qq.com确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。  
         */
        Code_1001 = 1001,
        /**
         * **异常情况**:广告单元无效  
         * **理由**:可能是拼写错误、或者误用了其他APP的广告ID  
         * **解决方案**:请重新前往mp.weixin.qq.com确认广告位ID。  
         */
        Code_1002 = 1002,
        /**
         * **异常情况**:内部错误  
         * **理由**:该项错误不是开发者的异常情况  
         * **解决方案**:一般情况下忽略一段时间即可恢复。  
         */
        Code_1003 = 1003,
        /**
         * **异常情况**:无适合的广告  
         * **理由**:广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告  
         * **解决方案**:属于正常情况，且开发者需要针对这种情况做形态上的兼容。  
         */
        Code_1004 = 1004,
        /**
         * **异常情况**:广告组件审核中  
         * **理由**:你的广告正在被审核，无法展现广告  
         * **解决方案**:请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。  
         */
        Code_1005 = 1005,
        /**
         * **异常情况**:广告组件被驳回  
         * **理由**:你的广告审核失败，无法展现广告  
         * **解决方案**:请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。  
         */
        Code_1006 = 1006,
        /**
         * **异常情况**:广告组件被驳回  
         * **理由**:你的广告能力已经被封禁，封禁期间无法展现广告  
         * **解决方案**:请前往mp.weixin.qq.com确认小程序广告封禁状态。  
         */
        Code_1007 = 1007,
        /**
         * **异常情况**:广告单元已关闭  
         * **理由**:该广告位的广告能力已经被关闭  
         * **解决方案**:请前往mp.weixin.qq.com重新打开对应广告位的展现。  
         */
        Code_1008 = 1008,

    }

    /**
     * 监听用户点击 关闭广告 按钮的事件回调函数的参数
     */
    interface RewardedVideoAdOnCloseParam {
        /**
         *  视频是否播放结束
         */
        isEnded: boolean;
    }

    /**
     * 监听用户点击 关闭广告 按钮的事件 的回调函数
     */
    interface RewardedVideoAdOnCloseCallback {
        (res: RewardedVideoAdOnCloseParam)
    }

    /**
     * 激励视频错误事件的回调参数
     */
    interface RewardedVideoAdOnErrorParam {
        errMsg: string;
        errCode: RewardedVideoAdErrorCode;
    }

    /**
     * 激励视频错误事件回调函数
     */
    interface RewardedVideoAdOnErrorCallback {
        (res: RewardedVideoAdOnErrorParam)
    }

    /**
     * 激励视频广告组件
     *
     * @
     * @interface RewardedVideoAd
     */
    interface RewardedVideoAd {
        /**
         * 加载激励视频广告
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.load.html
         * @returns {Promise<void>} 加载完成后返回
         * @memberof RewardedVideoAd
         */
        load(): Promise<void>;

        /**
         * 显示激励视频广告。激励视频广告将从屏幕下方推入。
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.show.html
         * 
         * @returns {Promise<{}>}
         * @memberof RewardedVideoAd
         */
        show(): Promise<{}>;

        /**
         * 监听激励视频广告加载事件
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.onLoad.html
         * @param {{ () }} callback
         * @memberof RewardedVideoAd
         */
        onLoad(callback: { () });

        /**
         * 取消监听激励视频广告加载事件
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.offLoad.html
         * @param {{ () }} callback
         * @memberof RewardedVideoAd
         */
        offLoad(callback: { () });

        /**
         * 监听激励视频错误事件
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.onError.html
         * 
         * @param {RewardedVideoAdOnErrorCallback} callback
         * @memberof RewardedVideoAd
         */
        onError(callback: RewardedVideoAdOnErrorCallback);

        /**
         * 取消监听激励视频错误事件
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.offError.html
         * 
         * @param {{ () }} callback
         * @memberof RewardedVideoAd
         */
        offError(callback: { () });

        /**
         * 监听用户点击 关闭广告 按钮的事件
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.onClose.html
         * 
         * @param {RewardedVideoAdOnCloseCallback} callback
         * @memberof RewardedVideoAd
         */
        onClose(callback: RewardedVideoAdOnCloseCallback);

        /**
         * 取消监听用户点击 关闭广告 按钮的事件
         * https://developers.weixin.qq.com/minigame/dev/document/ad/RewardedVideoAd.offClose.html
         * 
         * @param {{ () }} callback
         * @memberof RewardedVideoAd
         */
        offClose(callback: { () });
    }

    const enum BannerAdErrorCode {
        /**
         * 异常情况：后端错误调用失败  
         * 理由：该项错误不是开发者的异常情况  
         * 解决方案：一般情况下忽略一段时间即可恢复。  
         */
        Code_1000 = 1000,
        /**
         * 异常情况：参数错误  
         * 理由：使用方法错误  
         * 解决方案：可以前往developers.weixin.qq.com确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。  
         */
        Code_1001 = 1001,
        /**
         * 异常情况：广告单元无效  
         * 理由：可能是拼写错误、或者误用了其他APP的广告ID  
         * 解决方案：请重新前往mp.weixin.qq.com确认广告位ID。  
         */
        Code_1002 = 1002,
        /**
         * 异常情况：内部错误  
         * 理由：该项错误不是开发者的异常情况  
         * 解决方案：一般情况下忽略一段时间即可恢复。  
         */
        Code_1003 = 1003,
        /**
         * 异常情况：无适合的广告  
         * 理由：广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告  
         * 解决方案：属于正常情况，且开发者需要针对这种情况做形态上的兼容。  
         */
        Code_1004 = 1004,
        /**
         * 异常情况：广告组件审核中  
         * 理由：你的广告正在被审核，无法展现广告  
         * 解决方案：请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。  
         */
        Code_1005 = 1005,
        /**
         * 异常情况：广告组件被驳回  
         * 理由：你的广告审核失败，无法展现广告  
         * 解决方案：请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。  
         */
        Code_1006 = 1006,
        /**
         * 异常情况：广告组件被驳回  
         * 理由：你的广告能力已经被封禁，封禁期间无法展现广告  
         * 解决方案：请前往mp.weixin.qq.com确认小程序广告封禁状态。  
         */
        Code_1007 = 1007,
        /**
         * 异常情况：广告单元已关闭  
         * 理由：该广告位的广告能力已经被关闭  
         * 解决方案：请前往mp.weixin.qq.com重新打开对应广告位的展现。  
         */
        Code_1008 = 1008,

    }

    interface BannerAdErrorParam {
        /**
         * 错误信息
         */
        errMsg: string;

        /**
         * 错误码  
         * @version >=2.2.2
         */
        errCode: BannerAdErrorCode;
    }

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.html
     */
    interface BannerAd {
        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.show.html  
         * 显示 banner 广告。
         */
        show(): Promise<void>;

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.hide.html  
         * 隐藏 banner 广告
         */
        hide();

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.destroy.html  
         * 销毁 banner 广告
         */
        destroy();

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.onResize.html  
         * 监听 banner 广告尺寸变化事件
         * @param callback  广告尺寸变化事件的回调函数
         */
        onResize(callback: { (res: SizeStyle) });

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.offResize.html  
         * 取消监听 banner 广告尺寸变化事件
         * @param callback 广告尺寸变化事件的回调函数
         */
        offResize(callback: { (res: SizeStyle) });

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.onLoad.html  
         * 监听 banner 广告加载事件  
         * @param callback 广告加载事件的回调函数
         */
        onLoad(callback: { () });

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.onLoad.html  
         * 取消监听 banner 广告加载事件  
         * @param callback 广告加载事件的回调函数
         */
        offLoad(callback: { () });


        /**
         * https://developers.weixin.qq.com/minigame/dev/api/BannerAd.onError.html  
         * 监听 banner 广告错误事件
         * @param callback 
         */
        onError(callback: { (res: BannerAdErrorParam) })

        /**
         * banner 广告组件的样式。style 上的属性的值仅为开发者设置的值，banner 广告会根据开发者设置的宽度进行等比缩放，缩放后的真实尺寸需要通过 BannerAd.onResize() 事件获得。
         */
        style: {
            /**
             * banner 广告组件的左上角横坐标
             */
            left: number;
            /**
             * banner 广告组件的左上角纵坐标
             */
            top: number;
            /**
             * banner 广告组件的宽度。最小 300，最大至 屏幕宽度（屏幕宽度可以通过 wx.getSystemInfoSync() 获取）。
             */
            width: number;
            /**
             * banner 广告组件的高度
             */
            height: number;
            /**
             * banner 广告组件经过缩放后真实的宽度
             */
            realWidth: number;
            /**
             * banner 广告组件经过缩放后真实的高度
             */
            realHeight: number;

        }
    }

    interface CreateBannerAdParam {

        /**
         * 	广告单元 id
         */
        adUnitId: string;

        /**
         * banner 广告组件的样式
         */
        style: RectanbleStyle;
    }

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/wx.createBannerAd.html
     * 
     * 创建 banner 广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API。同时，开发者工具上暂不支持调试该 API，请直接在真机上进行调试。  
     * 
     * **注意**   
     * 小游戏广告能力目前暂时以邀请制开放申请，请留意后续通知
     * @param param 
     */
    function createBannerAd(param: CreateBannerAdParam): BannerAd;

    //--------------------------生命周期-------------------------------

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/wx.exitMiniProgram.html
     * 退出当前小游戏
     * @param callback 
     */
    function exitMiniProgram(callback: Callback);

    /**
     * 场景值  
     * https://developers.weixin.qq.com/minigame/dev/framework/scene.html
     * 
     * * 对于小程序，可以在 App 的 onLaunch 和 onShow，或wx.getLaunchOptionsSync 中获取上述场景值。
     * * 对于小游戏，可以在 wx.getLaunchOptionsSync 和 wx.onShow 中获取上述场景值
部分场景值下还可以获取来源应用、公众号或小程序的appId。  

     * **Tip**: 由于Android系统限制，目前还无法获取到按 Home 键退出到桌面，然后从桌面再次进小程序的场景值，对于这种情况，会保留上一次的场景值。
     */
    const enum Scene {
        /**
         * 发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表）  
         */
        Scene_1001 = 1001,
        /**
         * 顶部搜索框的搜索结果页  
         */
        Scene_1005 = 1005,
        /**
         * 发现栏小程序主入口搜索框的搜索结果页  
         */
        Scene_1006 = 1006,
        /**
         * 单人聊天会话中的小程序消息卡片  
         */
        Scene_1007 = 1007,
        /**
         * 群聊会话中的小程序消息卡片  
         */
        Scene_1008 = 1008,
        /**
         * 扫描二维码  
         */
        Scene_1011 = 1011,
        /**
         * 长按图片识别二维码  
         */
        Scene_1012 = 1012,
        /**
         * 手机相册选取二维码  
         */
        Scene_1013 = 1013,
        /**
         * 小程序模板消息  
         */
        Scene_1014 = 1014,
        /**
         * 前往体验版的入口页  
         */
        Scene_1017 = 1017,
        /**
         * 微信钱包  
         */
        Scene_1019 = 1019,
        /**
         * 公众号 profile 页相关小程序列表  
         */
        Scene_1020 = 1020,
        /**
         * 聊天顶部置顶小程序入口  
         */
        Scene_1022 = 1022,
        /**
         * 安卓系统桌面图标  
         */
        Scene_1023 = 1023,
        /**
         * 小程序 profile 页  
         */
        Scene_1024 = 1024,
        /**
         * 扫描一维码  
         */
        Scene_1025 = 1025,
        /**
         * 附近小程序列表  
         */
        Scene_1026 = 1026,
        /**
         * 顶部搜索框搜索结果页「使用过的小程序」列表  
         */
        Scene_1027 = 1027,
        /**
         * 我的卡包  
         */
        Scene_1028 = 1028,
        /**
         * 卡券详情页  
         */
        Scene_1029 = 1029,
        /**
         * 自动化测试下打开小程序  
         */
        Scene_1030 = 1030,
        /**
         * 长按图片识别一维码  
         */
        Scene_1031 = 1031,
        /**
         * 手机相册选取一维码  
         */
        Scene_1032 = 1032,
        /**
         * 微信支付完成页  
         */
        Scene_1034 = 1034,
        /**
         * 公众号自定义菜单  
         */
        Scene_1035 = 1035,
        /**
         * App 分享消息卡片  
         */
        Scene_1036 = 1036,
        /**
         * 小程序打开小程序  
         */
        Scene_1037 = 1037,
        /**
         * 从另一个小程序返回  
         */
        Scene_1038 = 1038,
        /**
         * 摇电视  
         */
        Scene_1039 = 1039,
        /**
         * 添加好友搜索框的搜索结果页  
         */
        Scene_1042 = 1042,
        /**
         * 公众号模板消息  
         */
        Scene_1043 = 1043,
        /**
         * 带 shareTicket 的小程序消息卡片 详情  
         */
        Scene_1044 = 1044,
        /**
         * 朋友圈广告  
         */
        Scene_1045 = 1045,
        /**
         * 朋友圈广告详情页  
         */
        Scene_1046 = 1046,
        /**
         * 扫描小程序码  
         */
        Scene_1047 = 1047,
        /**
         * 长按图片识别小程序码  
         */
        Scene_1048 = 1048,
        /**
         * 手机相册选取小程序码  
         */
        Scene_1049 = 1049,
        /**
         * 卡券的适用门店列表  
         */
        Scene_1052 = 1052,
        /**
         * 搜一搜的结果页  
         */
        Scene_1053 = 1053,
        /**
         * 顶部搜索框小程序快捷入口  
         */
        Scene_1054 = 1054,
        /**
         * 音乐播放器菜单  
         */
        Scene_1056 = 1056,
        /**
         * 钱包中的银行卡详情页  
         */
        Scene_1057 = 1057,
        /**
         * 公众号文章  
         */
        Scene_1058 = 1058,
        /**
         * 体验版小程序绑定邀请页  
         */
        Scene_1059 = 1059,
        /**
         * 微信连Wi-Fi状态栏  
         */
        Scene_1064 = 1064,
        /**
         * 公众号文章广告  
         */
        Scene_1067 = 1067,
        /**
         * 附近小程序列表广告  
         */
        Scene_1068 = 1068,
        /**
         * 移动应用  
         */
        Scene_1069 = 1069,
        /**
         * 钱包中的银行卡列表页  
         */
        Scene_1071 = 1071,
        /**
         * 二维码收款页面  
         */
        Scene_1072 = 1072,
        /**
         * 客服消息列表下发的小程序消息卡片  
         */
        Scene_1073 = 1073,
        /**
         * 公众号会话下发的小程序消息卡片  
         */
        Scene_1074 = 1074,
        /**
         * 摇周边  
         */
        Scene_1077 = 1077,
        /**
         * 连Wi-Fi成功页  
         */
        Scene_1078 = 1078,
        /**
         * 微信游戏中心  
         */
        Scene_1079 = 1079,
        /**
         * 客服消息下发的文字链  
         */
        Scene_1081 = 1081,
        /**
         * 公众号会话下发的文字链  
         */
        Scene_1082 = 1082,
        /**
         * 朋友圈广告原生页  
         */
        Scene_1084 = 1084,
        /**
         * 微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）  
         */
        Scene_1089 = 1089,
        /**
         * 长按小程序右上角菜单唤出最近使用历史  
         */
        Scene_1090 = 1090,
        /**
         * 公众号文章商品卡片  
         */
        Scene_1091 = 1091,
        /**
         * 城市服务入口  
         */
        Scene_1092 = 1092,
        /**
         * 小程序广告组件  
         */
        Scene_1095 = 1095,
        /**
         * 聊天记录  
         */
        Scene_1096 = 1096,
        /**
         * 微信支付签约页  
         */
        Scene_1097 = 1097,
        /**
         * 页面内嵌插件  
         */
        Scene_1099 = 1099,
        /**
         * 公众号 profile 页服务预览  
         */
        Scene_1102 = 1102,
        /**
         * 发现栏小程序主入口，「我的小程序」列表（基础库2.2.4版本起废弃）  
         */
        Scene_1103 = 1103,
        /**
         * 微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）  
         */
        Scene_1104 = 1104,

    }

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getLaunchOptionsSync.html
     * 启动属性
     */
    interface LaunchOption {
        /**
         * 启动小游戏的场景值	  
         */
        scene: Scene;
        /**
         * 启动小游戏的 query 参数	  
         */
        query: any;
        /**
         * shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/share/share.html#%E8%8E%B7%E5%8F%96%E6%9B%B4%E5%A4%9A%E8%BD%AC%E5%8F%91%E4%BF%A1%E6%81%AF)	  
         */
        shareTicket: string;
        /**
         * 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。(参见后文注意)	  
         */
        referrerInfo: ReferrerInfo;

    }

    /**
     * 返回有效 referrerInfo 的场景  
     * 
        | 场景值	| 场景 | appId含义 |
        | --- | --- | --- |
        | 1020 |公众号 profile 页相关小程序列表 |	来源公众号 |
        | 1035 |公众号自定义菜单 |来源公众号 |
        | 1036 |App 分享消息卡片 |来源App |
        | 1037 |小程序打开小程序 |来源小程序 |
        | 1038 |从另一个小程序返回 |来源小程序 |
        | 1043 |公众号模板消息 |来源公众号 |
     */
    interface ReferrerInfo {
        /**
         * 来源小程序、公众号或 App 的 appId	  
         */
        appId: string;
        /**
         * 来源小程序传过来的数据，scene=1037或1038时支持  
         */
        extraData: object;

    }

    function getLaunchOptionsSync(): LaunchOption;


    /**
     * 取消监听小游戏隐藏到后台事件  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.offHide.html
     * @param callback 小游戏隐藏到后台事件的回调函数
     */
    function offHide(callback: ({}));

    /**
     * 取消监听小游戏回到前台的事件  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.offShow.html
     * @param callback 小游戏回到前台的事件的回调函数
     */
    function offShow(callback: ({}));

    /**
     * 监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
     * https://developers.weixin.qq.com/minigame/dev/api/wx.onHide.html
     * @param callback 小游戏隐藏到后台事件的回调函数
     */
    function onHide(callback: ({}));

    /**
     * 监听小游戏回到前台的事件
     * @param callback 小游戏回到前台的事件的回调函数
     */
    function onShow(callback: { (res: LaunchOption) });

    interface OpenCustomerServiceConversationParam extends Callback {
        /**
         * 会话来源
         */
        sessionFrom?: string;
        /**
         * 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话之后会收到一个消息卡片，通过以下三个参数设置卡片的内容
         */
        showMessageCard?: boolean;
        /**
         * 会话内消息卡片标题
         */
        sendMessageTitle?: string;
        /**
         * 会话内消息卡片路径
         */
        sendMessagePath?: string;
        /**
         * 会话内消息卡片图片路径
         */
        sendMessageImg?: string;
    }

    /**
     * 进入客服会话
     * https://developers.weixin.qq.com/minigame/dev/api/wx.openCustomerServiceConversation.html
     * 要求在用户发生过至少一次 touch 事件后才能调用。后台接入方式与小程序一致，详见 客服消息接入
     */
    function openCustomerServiceConversation(param?: OpenCustomerServiceConversationParam);

    //--------------------------电量---------------------------------

    interface GetBattleryInfoSuccessRtn {
        /**
         * 设备电量，范围 1 - 100
         */
        level: string;
        /**
         * 	是否正在充电中
         */
        isCharging: boolean;
    }

    interface GetBattleryInfoParam extends Callback {
        success(ret: GetBattleryInfoSuccessRtn)
    }

    /**
     * 获取设备电量。 在 iOS 上不可用。  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getBatteryInfo.html
     * 实际测试，此API在ios上不可用
     */
    function getBatteryInfo(param: GetBattleryInfoParam);

    /**
     * 获取设备电量的同步版本  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getBatteryInfoSync.html
     */
    function getBatteryInfoSync(): GetBattleryInfoSuccessRtn;

    //--------------------------剪贴板-------------------------------
    interface SetClipboardDataParam extends Callback {
        /**
         * 剪贴板的内容
         */
        data?: string;
    }

    /**
     * 设置系统剪贴板的内容  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.setClipboardData.html
     * 
     * @version >1.1.0
     * 
     * @param obj 
     * 
     * @example
     * wx.setClipboardData({
     *      data: 'data',
     *      success(res) {
     *      wx.getClipboardData({
     *          success(res) {
     *              console.log(res.data) // data
     *          }
     *      })
     *      }
     * })
     */
    function setClipboardData(obj: SetClipboardDataParam);

    interface GetClipboardDataSuccessRtn {
        /**
         * 剪贴板的内容
         */
        data: string;
    }

    interface GetClipboardDataParam extends Callback {
        success(res: GetClipboardDataSuccessRtn);
    }

    /**
     * 获取系统剪贴板的内容  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.getClipboardData.html
     * 
     * @version >1.1.0
     * @param obj 
     * 
     * @example
     * wx.getClipboardData({
     *  success(res) {
     *      console.log(res.data)
     *  }
     * }) 
     * 
     */
    function getClipboardData(obj: GetClipboardDataParam);

    interface PreviewImageParam extends Callback {
        /**
         * 需要预览的图片链接列表。2.2.3 起支持云文件ID。
         */
        urls: string[];

        /**
         * 当前显示图片的链接  
         * 默认值：urls 的第一张
         */
        current?: string;

    }

    /**
     * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。  
     * https://developers.weixin.qq.com/minigame/dev/api/wx.previewImage.html  
     * 
     * @param opt 
     * 
     * @example
     * wx.previewImage({
     *   current: '', // 当前显示图片的http链接
     *   urls: [] // 需要预览的图片http链接列表
     * })
     */
    function previewImage(opt: PreviewImageParam);

    /**
     * 认证域  
     * https://developers.weixin.qq.com/minigame/dev/guide/framework/authorize.html
     */
    const enum AuthorizeScope {
        /**
         * 用户信息  
         * 对应接口 `wx.getUserInfo`
         */
        UserInfo = "scope.userInfo",

        /**
         * 地理位置  
         * 对应接口 `wx.getLocation`
         */
        UserLocation = "scope.userLocation",

        /**
         * 微信运动步数  
         * 对应接口 `wx.getWeRunData`  
         */
        WeRun = "scope.werun",
        /**
         * 保存到相册  
         * 对应接口 `wx.saveImageToPhotosAlbum`
         */
        WritePhotosAlbum = "scope.writePhotosAlbum",

    }


    interface AuthorizeParam extends Callback {
        /**
         * 需要获取权限的 scope
         */
        scope: AuthorizeScope;

    }

    /**
     * https://developers.weixin.qq.com/minigame/dev/api/open-api/authorize/wx.authorize.html
     * https://developers.weixin.qq.com/minigame/dev/guide/framework/authorize.html
     * 
     * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。更多用法详见[用户授权](https://developers.weixin.qq.com/minigame/dev/guide/framework/authorize.html)
     * 
     * @example
     * // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
     * wx.getSetting({
     * success(res) {
     *   if (!res.authSetting['scope.record']) {
     *      wx.authorize({
     *        scope: 'scope.record',
     *        success () {
     *          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
     *          wx.startRecord()
     *        }
     *      })
     *    }
     *  }
     *})
     */
    function authorize(opt: AuthorizeParam);

    /**
     * 用户授权设置信息  
     * https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/AuthSetting.html
     */
    interface AuthSetting {
        /**
         * 是否授权用户信息，对应接口 `wx.getUserInfo`
         */
        [AuthorizeScope.UserInfo]: boolean;

        /**
         * 是否授权地理位置，对应接口 `wx.getLocation`
         */
        [AuthorizeScope.UserLocation]: boolean;

        /**
         * 是否授权微信运动步数，对应接口 `wx.getWeRunData`
         */
        [AuthorizeScope.WeRun]: boolean;

        /**
         * 是否授权保存到相册 `wx.saveImageToPhotosAlbum`
         */
        [AuthorizeScope.WritePhotosAlbum]: boolean;
    }

    interface GetSettingParam extends Callback {
        success: { (res: { authSetting: AuthSetting }) }
    }

    /**
     * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。  
     * https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.getSetting.html
     * @param opt 
     * 
     * @example
     * wx.getSetting({
     *   success (res) {
     *     console.log(res.authSetting)
     *     // res.authSetting = {
     *     //   "scope.userInfo": true,
     *     //   "scope.userLocation": true
     *     // }
     *   }
     * })
     */
    function getSetting(opt: GetSettingParam);

}