import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        home: 'Home',
        tours: 'Tours',
        myTrip: 'My Trip',
        menu: 'Menu',
        profile: 'Profile',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        loading: 'Loading...',
        error: 'Something went wrong'
      },
      home: {
        welcome: 'Welcome to Holy Travels',
        featuredTours: 'Featured Tours',
        upcomingTrip: 'Your Upcoming Trip',
        viewAll: 'View All'
      },
      emergency: {
        title: 'Emergency',
        sosButton: 'SOS - Need Help',
        alertSent: 'Alert sent! Help is on the way.',
        cancel: 'Cancel Alert'
      },
      menu: {
        today: "Today's Menu",
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner'
      },
      profile: {
        totalTrips: 'Total Trips',
        memberTier: 'Member Tier',
        points: 'Points'
      }
    }
  },
  hi: {
    translation: {
      common: {
        home: 'होम',
        tours: 'यात्राएं',
        myTrip: 'मेरी यात्रा',
        menu: 'मेन्यू',
        profile: 'प्रोफाइल',
        login: 'लॉग इन',
        register: 'रजिस्टर',
        logout: 'लॉग आउट',
        loading: 'लोड हो रहा है...',
        error: 'कुछ गलत हो गया'
      },
      home: {
        welcome: 'होली ट्रैवल्स में आपका स्वागत है',
        featuredTours: 'विशेष यात्राएं',
        upcomingTrip: 'आपकी आगामी यात्रा',
        viewAll: 'सभी देखें'
      },
      emergency: {
        title: 'आपातकाल',
        sosButton: 'SOS - मदद चाहिए',
        alertSent: 'अलर्ट भेजा गया! मदद आ रही है।',
        cancel: 'अलर्ट रद्द करें'
      },
      menu: {
        today: 'आज का मेन्यू',
        breakfast: 'नाश्ता',
        lunch: 'दोपहर का भोजन',
        dinner: 'रात का भोजन'
      },
      profile: {
        totalTrips: 'कुल यात्राएं',
        memberTier: 'सदस्यता स्तर',
        points: 'पॉइंट्स'
      }
    }
  },
  mr: {
    translation: {
      common: {
        home: 'मुख्यपृष्ठ',
        tours: 'सहली',
        myTrip: 'माझी सहल',
        menu: 'मेनू',
        profile: 'प्रोफाइल',
        login: 'लॉग इन',
        register: 'नोंदणी',
        logout: 'लॉग आउट',
        loading: 'लोड होत आहे...',
        error: 'काहीतरी चूक झाली'
      },
      home: {
        welcome: 'होली ट्रॅव्हल्समध्ये स्वागत आहे',
        featuredTours: 'वैशिष्ट्यीकृत सहली',
        upcomingTrip: 'तुमची आगामी सहल',
        viewAll: 'सर्व पहा'
      },
      emergency: {
        title: 'आणीबाणी',
        sosButton: 'SOS - मदत हवी आहे',
        alertSent: 'अलर्ट पाठवला! मदत येत आहे.',
        cancel: 'अलर्ट रद्द करा'
      },
      menu: {
        today: 'आजचा मेनू',
        breakfast: 'नाश्ता',
        lunch: 'दुपारचे जेवण',
        dinner: 'रात्रीचे जेवण'
      },
      profile: {
        totalTrips: 'एकूण सहली',
        memberTier: 'सदस्यता स्तर',
        points: 'पॉइंट्स'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

