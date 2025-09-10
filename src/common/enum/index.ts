export enum EAdminStatus {
  'active',
  'in_active',
  'block',
}

export enum EAdminRoles {
  'admin',
  'supper_admin',
}

export enum ERols {
  ADMIN = "admin",
  SUPPER_ADMIN = "supper_admin",
  DOCTOR = "doctor",
  PATIENTS = "patients"
}

export enum EAppointments {
  PENDING = 'pending',
  CONFIRMEND = 'confirmend',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ECommentSender {
  'doctor',
  'patients',
}

export enum EDoctor {
  Dushanba = 'Dushanba',
  Seshanba = 'Seshanba',
  Chorshanba = 'Chorshanba',
  Payshanba = 'Payshanba',
  Juma = 'Juma',
  Shanba = 'Shanba',
  Yakshanba = 'Yakshanba',
}

export enum EDoctorGender {
  "mail",
  "femail"
}

export enum ERegion {
  ANDIJON = "Andijon",
  BUXORO = "Buxoro",
  FARGONA = "Farg‘ona",
  JIZZAX = "Jizzax",
  XORAZM = "Xorazm",
  NAMANGAN = "Namangan",
  NAVOIY = "Navoiy",
  QASHQADARYO = "Qashqadaryo",
  QORAQALPOGISTON = "Qoraqalpog‘iston Respublikasi",
  SAMARQAND = "Samarqand",
  SIRDARYO = "Sirdaryo",
  SURXONDARYO = "Surxondaryo",
  TOSHKENT = "Toshkent viloyati",
  TOSHKENT_SHAHRI = "Toshkent shahri",
}
