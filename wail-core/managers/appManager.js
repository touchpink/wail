import Pather from '../util/pather'
import ContextMenu from '../util/contextMenu'
import Promise from 'bluebird'
import SettingsManager from './settingsManager'
import ServiceManager from './serviceManager'
import S from 'string'
S.TMPL_OPEN = '{'
S.TMPL_CLOSE = '}'

const isDev = process.env.NODE_ENV === 'development'

export default class AppManager {
  constructor () {
    this.settingsMan = null
    this.pathMan = null
    this.w = 1000
    this.h = 600
    this.iconp = null
    this.tray = null
    this.base = null
    this.notDebugUI = false
    this.debug = false
    this.openBackGroundWindows = false
    this.didClose = false
    this.didLoad = false
    this.loading = true
    this.firstLoad = false
    this.contextMenu = null
    this.serviceMan = null
    this.winConfigs = null
    this.winConf = null
    this.logPath = null
  }

  init (base, userData, version, loadFrom, debug = false, notDebugUI = false, openBackGroundWindows = false) {
    console.log('appManager init')
    return new Promise((resolve) => {
      this.notDebugUI = notDebugUI
      this.debug = debug
      this.openBackGroundWindows = openBackGroundWindows
      this.contextMenu = new ContextMenu()
      this.base = base
      this.pathMan = global.pathMan = new Pather(this.base)
      let logPath
      let v = version
      let settingsPath = userData
      if (process.env.NODE_ENV === 'development') {
        logPath = this.pathMan.joinWBase('waillogs')// path.join(control.base, 'waillogs')
        v = '1.0.0-rc.2.6'
        settingsPath = logPath
      } else {
        logPath = this.pathMan.join(settingsPath, 'waillogs')// path.join(app.getPath('userData'), 'waillogs')
      }
      this.logPath = logPath
      this.settingsMan = new SettingsManager(base, settingsPath, v)
      return this.settingsMan.configure()
        .then(() => {
          if (!this.settingsMan.get('didFirstLoad')) {
            this.firstLoad = true
            settings.set('didFirstLoad', true)
          }
          if (process.platform === 'darwin') {
            this.iconp = this.pathMan.normalizeJoinWBase('icons/whale.icns') // path.normalize(path.join(control.base, 'src/icons/whale.icns'))
            this.w = 1000
            this.h = 500
          } else if (process.platform === 'win32') {
            // console.log('windows')
            this.iconp = this.pathMan.normalizeJoinWBase('icons/whale.ico')
            this.w = 1000
            this.h = 500
          } else {
            this.iconp = this.pathMan.normalizeJoinWBase('icons/linux/whale_64.png')
            this.w = 1000
            this.h = 500
          }

          this.serviceMan = new ServiceManager(this.settingsMan)
          this.winConf = {
            width: this.w,
            minWidth: this.w,
            // maxWidth: this.w,
            height: this.h,
            minHeight: this.h,
            // maxHeight: this.h,
            title: 'Web Archiving Integration Layer',
            fullscreenable: false,
            maximizable: false,
            show: false,
            icon: this.iconp
          }
          this.winConfigs = [
            {
              conf: this.winConf,
              url: `file://${loadFrom}/wail.html`,
              name: 'mainWindow'
            },
            {
              conf: this.winConf,
              fLoadUrl: `file://${loadFrom}/loadingScreens/firstTime/loadingScreen.html`,
              notFLoadUrl: `file://${loadFrom}/loadingScreens/notFirstTime/loadingScreen.html`,
              name: 'loadingWindow'
            },
            {
              conf: {
                width: 800,
                height: process.platform === 'win32' ? 380 : 360,
                modal: true,
                show: false,
                closable: true,
                minimizable: false,
                autoHideMenuBar: true
              },
              url: `file://${loadFrom}/childWindows/newCrawl/newCrawl.html`,
              name: 'newCrawlWindow'
            },
            {
              conf: {
                width: 784,
                height: 350,
                modal: false,
                show: false,
                minimizable: false,
                autoHideMenuBar: true
              },
              url: `file://${loadFrom}/childWindows/settings/settingsW.html`,
              name: 'newCrawlWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/accessibility.html`,
              name: 'accessibilityWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/indexer.html`,
              name: 'indexWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/jobs.html`,
              name: 'jobWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/requestDaemon.html`,
              name: 'reqDaemonWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/managers.html`,
              name: 'managersWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/crawls.html`,
              name: 'crawlManWindow'
            },
            {
              conf: { show: false },
              url: `file://${loadFrom}/background/archives.html`,
              name: 'archiveManWindow'
            }
          ]
          return resolve()
        })
    })
  }

}