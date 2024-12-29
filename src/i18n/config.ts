import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // General UI
      "monitoringPanel": "Monitoring Panel",
      "smartgridDescription": "smartgrid energy efficiency in Pomerania",
      "configureApiKey": "Configure API Key",
      "spaces": "Spaces",
      "analysis": "Analysis",
      "status": "Status",
      "sensors": "Sensors",
      "uploadFile": "Upload File",
      "aiAssistant": "AI Assistant",
      "dataComparison": "Data Comparison",
      "selectCity": "Select City",
      "selectParameter": "Select Parameter",
      "comparison": "Comparison",
      
      // Failure Analysis
      "failureAnalysis": "Failure Analysis",
      "deviceStatus": "Device Status",
      "criticalStatus": "Critical",
      "warningStatus": "Warning",
      "possibleCauses": "Possible Causes",
      "recommendedActions": "Recommended Actions",
      
      // Energy Data
      "energyConsumption": "Energy Consumption",
      "energyProduction": "Energy Production",
      "efficiency": "Efficiency",
      "powerUsage": "Power Usage",
      
      // Notifications
      "languageChanged": "Language Changed",
      "languageChangedTo": "Language has been changed to",
      
      // Tooltips
      "clickForDetails": "Click for details",
      "scrollForMore": "Scroll for more information",
      "compareData": "Compare data between cities"
    }
  },

"pl": {
    translation: {
      // General UI
      "monitoringPanel": "Panel Monitoringu",
      "smartgridDescription": "efektywność energetyczna smartgrid na Pomorzu",
      "configureApiKey": "Konfiguruj klucz API",
      "spaces": "Przestrzenie",
      "analysis": "Analiza",
      "status": "Status",
      "sensors": "Czujniki",
      "uploadFile": "Wgraj plik",
      "aiAssistant": "Asystent AI",
      "dataComparison": "Porównanie Danych",
      "selectCity": "Wybierz Miasto",
      "selectParameter": "Wybierz Parametr",
      "comparison": "Porównanie",
      
      // Failure Analysis
      "failureAnalysis": "Analiza Awarii",
      "deviceStatus": "Status Urządzeń",
      "criticalStatus": "Krytyczny",
      "warningStatus": "Ostrzeżenie",
      "possibleCauses": "Możliwe Przyczyny",
      "recommendedActions": "Zalecane Działania",
      
      // Energy Data
      "energyConsumption": "Zużycie Energii",
      "energyProduction": "Produkcja Energii",
      "efficiency": "Wydajność",
      "powerUsage": "Zużycie Mocy",
      
      // Notifications
      "languageChanged": "Zmieniono Język",
      "languageChangedTo": "Zmieniono język na",
      
      // Tooltips
      "clickForDetails": "Kliknij po szczegóły",
      "scrollForMore": "Przewiń, aby zobaczyć więcej",
      "compareData": "Porównaj dane między miastami"
      
      // IoT Status
      "iotStatus": "Status IoT",
      "overallStatus": "Status ogólny",
      "requiresAttention": "Wymaga uwagi",
      "lastUpdate": "Ostatnia aktualizacja",
      "minutesAgo": "min temu",
      "deviceStatus": "Status Urządzeń",
      "systemPerformance": "Wydajność Systemu",
      "activeDevices": "Aktywne urządzenia",
      "networkConnection": "Połączenie z siecią",
      "signalQuality": "Jakość sygnału",
      "devicesOnline": "Liczba urządzeń aktualnie online",
      "networkStability": "Stabilność połączenia sieciowego",
      "signalStrength": "Siła i jakość sygnału IoT",
      "cpuUsage": "Wykorzystanie CPU",
      "memoryUsage": "Wykorzystanie pamięci",
      "networkLatency": "Opóźnienie sieci",
      "processorLoad": "Aktualne obciążenie procesora",
      "ramUsage": "Zużycie pamięci RAM",
      "connectionLatency": "Latencja połączenia sieciowego",
      "exportToPDF": "Eksportuj do PDF",
      "exportToJPG": "Eksportuj do JPG",
      "back": "Powrót"
    }
  },

  de: {
    translation: {
      // General UI
      "monitoringPanel": "Überwachungspanel",
      "smartgridDescription": "Smartgrid-Energieeffizienz in Pommern",
      "configureApiKey": "API-Schlüssel konfigurieren",
      "spaces": "Räume",
      "analysis": "Analyse",
      "status": "Status",
      "sensors": "Sensoren",
      "uploadFile": "Datei hochladen",
      "aiAssistant": "KI-Assistent",
      "dataComparison": "Datenvergleich",
      "selectCity": "Stadt auswählen",
      "selectParameter": "Parameter auswählen",
      "comparison": "Vergleich",
      
      // Failure Analysis
      "failureAnalysis": "Störungsanalyse",
      "deviceStatus": "Gerätestatus",
      "criticalStatus": "Kritisch",
      "warningStatus": "Warnung",
      "possibleCauses": "Mögliche Ursachen",
      "recommendedActions": "Empfohlene Maßnahmen",
      
      // Energy Data
      "energyConsumption": "Energieverbrauch",
      "energyProduction": "Energieproduktion",
      "efficiency": "Effizienz",
      "powerUsage": "Stromverbrauch",
      
      // Notifications
      "languageChanged": "Sprache geändert",
      "languageChangedTo": "Sprache wurde geändert zu",
      
      // Tooltips
      "clickForDetails": "Klicken Sie für Details",
      "scrollForMore": "Scrollen Sie für mehr Informationen",
      "compareData": "Daten zwischen Städten vergleichen"
    }
  },
  uk: {
    translation: {
      // General UI
      "monitoringPanel": "Панель моніторингу",
      "smartgridDescription": "енергоефективність смартгрід у Померанії",
      "configureApiKey": "Налаштувати API ключ",
      "spaces": "Простори",
      "analysis": "Аналіз",
      "status": "Статус",
      "sensors": "Датчики",
      "uploadFile": "Завантажити файл",
      "aiAssistant": "AI асистент",
      "dataComparison": "Порівняння даних",
      "selectCity": "Вибрати місто",
      "selectParameter": "Вибрати параметр",
      "comparison": "Порівняння",
      
      // Failure Analysis
      "failureAnalysis": "Аналіз несправностей",
      "deviceStatus": "Статус пристроїв",
      "criticalStatus": "Критичний",
      "warningStatus": "Попередження",
      "possibleCauses": "Можливі причини",
      "recommendedActions": "Рекомендовані дії",
      
      // Energy Data
      "energyConsumption": "Споживання енергії",
      "energyProduction": "Виробництво енергії",
      "efficiency": "Ефективність",
      "powerUsage": "Використання енергії",
      
      // Notifications
      "languageChanged": "Мову змінено",
      "languageChangedTo": "Мову змінено на",
      
      // Tooltips
      "clickForDetails": "Натисніть для деталей",
      "scrollForMore": "Прокрутіть для додаткової інформації",
      "compareData": "Порівняти дані між містами"
    }
  },
  ru: {
    translation: {
      // General UI
      "monitoringPanel": "Панель мониторинга",
      "smartgridDescription": "энергоэффективность смартгрид в Померании",
      "configureApiKey": "Настроить API ключ",
      "spaces": "Пространства",
      "analysis": "Анализ",
      "status": "Статус",
      "sensors": "Датчики",
      "uploadFile": "Загрузить файл",
      "aiAssistant": "AI ассистент",
      "dataComparison": "Сравнение данных",
      "selectCity": "Выбрать город",
      "selectParameter": "Выбрать параметр",
      "comparison": "Сравнение",
      
      // Failure Analysis
      "failureAnalysis": "Анализ неисправностей",
      "deviceStatus": "Статус устройств",
      "criticalStatus": "Критический",
      "warningStatus": "Предупреждение",
      "possibleCauses": "Возможные причины",
      "recommendedActions": "Рекомендуемые действия",
      
      // Energy Data
      "energyConsumption": "Потребление энергии",
      "energyProduction": "Производство энергии",
      "efficiency": "Эффективность",
      "powerUsage": "Использование энергии",
      
      // Notifications
      "languageChanged": "Язык изменен",
      "languageChangedTo": "Язык изменен на",
      
      // Tooltips
      "clickForDetails": "Нажмите для подробностей",
      "scrollForMore": "Прокрутите для дополнительной информации",
      "compareData": "Сравнить данные между городами"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'pl',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
