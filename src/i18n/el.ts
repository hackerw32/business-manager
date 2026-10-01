import type { Translation } from './en';

const el: Translation = {
  app: {
    name: 'Business Manager',
    tagline: 'Το μεσιτικό-τεχνικό γραφείο σου, οργανωμένο.',
  },
  nav: {
    dashboard: 'Αρχική',
    todos: 'Εκκρεμότητες',
    partners: 'Συνεργάτες',
    clients: 'Πελάτες',
    finances: 'Οικονομικά',
    appointments: 'Ραντεβού',
    info: 'Χρήσιμες Πληροφορίες',
    inspections: 'Τεχνικός Έλεγχος',
    settings: 'Ρυθμίσεις',
    logout: 'Αποσύνδεση',
    sectionApps: 'Εφαρμογές',
  },
  apps: {
    todos: {
      title: 'Εκκρεμότητες',
      short: 'Εκκρεμότητες',
      description: 'Παρακολούθηση ανοιχτών εργασιών, προθεσμιών και follow-ups.',
    },
    partners: {
      title: 'Συνεργάτες',
      short: 'Συνεργάτες',
      description: 'Διαχείριση συνεργατών, προμηθευτών και συναδέλφων.',
    },
    clients: {
      title: 'Πελάτες',
      short: 'Πελάτες',
      description: 'Η λίστα πελατών, επαφές και ιστορικό.',
    },
    finances: {
      title: 'Οικονομικά',
      short: 'Οικονομικά',
      description: 'Έσοδα, έξοδα, πληρωμές και υπόλοιπα.',
    },
    appointments: {
      title: 'Ραντεβού',
      short: 'Ραντεβού',
      description: 'Προγραμματισμός συναντήσεων και επισκέψεων.',
    },
    info: {
      title: 'Χρήσιμες Πληροφορίες',
      short: 'Χρήσιμες Πληροφορίες',
      description: 'Σημειώσεις, αναφορές και σημαντικές πληροφορίες.',
    },
    inspections: {
      title: 'Τεχνικός Έλεγχος',
      short: 'Τεχνικός Έλεγχος',
      description: 'Τεχνικοί έλεγχοι και αυτοψίες ακινήτων.',
    },
  },
  common: {
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    close: 'Κλείσιμο',
    back: 'Πίσω',
    search: 'Αναζήτηση',
    add: 'Προσθήκη',
    edit: 'Επεξεργασία',
    delete: 'Διαγραφή',
    confirm: 'Επιβεβαίωση',
    loading: 'Φόρτωση…',
    empty: 'Δεν υπάρχει κάτι ακόμα.',
    comingSoon: 'Έρχεται σύντομα',
    comingSoonText:
      'Αυτή η εφαρμογή είναι υπό κατασκευή. Τα δεδομένα και οι λειτουργίες της θα προστεθούν στη συνέχεια.',
    open: 'Άνοιγμα',
  },
  settings: {
    title: 'Ρυθμίσεις',
    appearance: 'Εμφάνιση',
    theme: 'Θέμα',
    themeLight: 'Φωτεινό',
    themeDark: 'Σκούρο',
    themeSystem: 'Συστήματος',
    language: 'Γλώσσα',
    languageEnglish: 'Αγγλικά',
    languageGreek: 'Ελληνικά',
    font: 'Μέγεθος γραμματοσειράς',
    fontSmall: 'Μικρό',
    fontMedium: 'Μεσαίο',
    fontLarge: 'Μεγάλο',
  },
  auth: {
    title: 'Καλώς ήρθες',
    subtitle: 'Συνδέσου για να αποκτήσεις πρόσβαση στον χώρο εργασίας σου.',
    email: 'Email',
    password: 'Κωδικός',
    signIn: 'Σύνδεση',
    signOut: 'Αποσύνδεση',
    signingIn: 'Σύνδεση…',
    errorInvalid: 'Λάθος email ή κωδικός.',
    errorGeneric: 'Κάτι πήγε στραβά. Δοκίμασε ξανά.',
  },
};

export default el;
