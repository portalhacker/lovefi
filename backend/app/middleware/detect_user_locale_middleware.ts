import { type HttpContext, RequestValidator } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { I18n } from '@adonisjs/i18n'
import i18nManager from '@adonisjs/i18n/services/main'

/**
 * The "DetectUserLocaleMiddleware" middleware uses i18n service to share
 * a request specific i18n object with the HTTP Context
 */
export default class DetectUserLocaleMiddleware {
  /**
   * Using i18n for validation messages. Applicable to only
   * "request.validateUsing" method calls
   */
  static {
    RequestValidator.messagesProvider = (ctx) => {
      return ctx.i18n.createMessagesProvider()
    }
  }

  /**
   * This method reads the user language from different sources
   * and returns the best matching locale by checking it
   * against the supported locales.
   *
   * The following sources are checked in order:
   * 1. the "locale" route parameter
   * 3. the "locale" cookie
   * 3. the "Accept-Language" header
   */
  protected getRequestLocale(ctx: HttpContext) {
    const localeParam = ctx.params.locale
    if (localeParam) {
      return i18nManager.getSupportedLocaleFor(localeParam)
    }

    const localeCookie = ctx.request.cookie('locale')
    if (localeCookie) {
      return i18nManager.getSupportedLocaleFor(localeCookie)
    }

    const userLanguages = ctx.request.languages()
    return i18nManager.getSupportedLocaleFor(userLanguages)
  }

  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Finding user language
     */
    const language = this.getRequestLocale(ctx)

    // Set the locale cookie if it doesn't exist or is different
    if (ctx.request.cookie('locale') !== language) {
      ctx.response.cookie('locale', language)
    }

    /**
     * Assigning i18n property to the HTTP context
     */
    ctx.i18n = i18nManager.locale(language || i18nManager.defaultLocale)

    /**
     * Binding I18n class to the request specific instance of it.
     * Doing so will allow IoC container to resolve an instance
     * of request specific i18n object when I18n class is
     * injected somewhere.
     */
    ctx.containerResolver.bindValue(I18n, ctx.i18n)

    /**
     * Sharing request specific instance of i18n with edge
     * templates.
     *
     * Remove the following block of code, if you are not using
     * edge templates.
     */
    if ('view' in ctx) {
      ctx.view.share({ i18n: ctx.i18n })
    }

    return next()
  }
}

/**
 * Notify TypeScript about i18n property
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    i18n: I18n
  }
}
