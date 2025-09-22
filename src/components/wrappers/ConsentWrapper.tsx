import { useEffect } from 'react';

import 'vanilla-cookieconsent/dist/cookieconsent.css';
import '@/styles/CookieConsent.css';

import * as CookieConsent from 'vanilla-cookieconsent';

export default function ConsentWrapper() {
  useEffect(() => {
    CookieConsent.run({
      mode: 'opt-in',
      autoShow: true,
      revision: 1,
      manageScriptTags: true,
      autoClearCookies: true,
      hideFromBots: true,
      guiOptions: {
        consentModal: {
          layout: 'bar',
          position: 'bottom',
          flipButtons: false,
          equalWeightButtons: true
        },
        preferencesModal: {
          layout: 'bar',
          position: 'right',
          flipButtons: false,
          equalWeightButtons: true
        }
      },
      cookie: {
        name: 'cc_cookie',
        domain: window.location.hostname,
        path: '/',
        sameSite: 'None',
        expiresAfterDays: 180
      },
      categories: {
        analytics: {
          enabled: true,
          services: {
            googleAnalytics: {
              label: 'Google Analytics',
              cookies: [{ name: '_ga' }, { name: '_gid' }]
            }
          }
        }
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies! 🍪',
              description:
                'This website uses cookies to ensure you get the best experience on our website.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Accept necessary',
              showPreferencesBtn: 'Customize'
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Accept necessary',
              savePreferencesBtn: 'Save preferences',
              sections: [
                {
                  title: 'Analytics',
                  description: 'Help us understand how visitors interact with our website.',
                  linkedCategory: 'analytics'
                }
              ]
            }
          }
        }
      }
    });
  }, []);

  return null;
}
