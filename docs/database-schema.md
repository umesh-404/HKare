I'm using

Front-End: HTML/React JS + CSS & Bootstrap
Middleware: Spring Boot 
Database Connectivity: Spring Data JPA 
Database: MYSQL
Webservices: Restful Web Services (REST API)
Architecture: Microservices

Below is your revised, enterprise-grade Hospital Management System schema incorporating a centralized users table for unified identity management and authentication. All user roles (DOCTOR, PATIENT, STAFF, ADMIN) are now mapped to this table, with specific details stored in role-specific extension tables. This approach improves security, simplifies authentication logic, and enhances maintainability.

## 1. Users Table (Master User Table)

users
- user_id (PK, UUID or auto-increment)
- email (unique)
- password (hashed)
- phone_number
- address
- date_of_birth
- gender
- profile_picture_url
- user_type (DOCTOR, PATIENT, STAFF, ADMIN)
- is_active (boolean)
- created_at
- updated_at

---

## 2. Doctors Table

doctors
- doctor_id (PK, format: DXXX…)
- user_id (FK to users.user_id, unique)
- first_name
- last_name
- specialization
- qualification
- experience_years
- license_number
- consultation_fee
- bio
- rating
- department_id (FK to departments.department_id)
- created_at
- updated_at

---

## 3. Patients Table

patients
- patient_id (PK, format: PXXX…)
- user_id (FK to users.user_id, unique)
- first_name
- last_name
- blood_group
- height
- weight
- allergies
- emergency_contact_name
- emergency_contact_phone
- insurance_provider
- insurance_id
- primary_doctor_id (FK to doctors.doctor_id, nullable)
- created_at
- updated_at

---

## 4. Staff Table

staff
- staff_id (PK, format: SXXX…)
- user_id (FK to users.user_id, unique)
- first_name
- last_name
- department_id (FK to departments.department_id)
- position
- hire_date
- created_at
- updated_at

---

## 5. Admins Table

admins
- admin_id (PK, format: AXXX…)
- user_id (FK to users.user_id, unique)
- first_name
- last_name
- department_id (FK to departments.department_id)
- position
- hire_date
- created_at
- updated_at

---

## 6. Departments Table

departments
- department_id (PK)
- name
- description
- head_doctor_id (FK to doctors.doctor_id, nullable)
- created_at
- updated_at

---

## 7. Appointments Table

appointments
- appointment_id (PK)
- patient_id (FK to patients.patient_id)
- doctor_id (FK to doctors.doctor_id)
- scheduled_by_id (FK to users.user_id)
- scheduled_by_type (PATIENT, STAFF, ADMIN, DOCTOR)
- appointment_date
- appointment_time
- status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- type (IN_PERSON, VIRTUAL)
- reason
- notes
- created_at
- updated_at

---

## 8. Medical Records Table

medical_records
- record_id (PK)
- patient_id (FK to patients.patient_id)
- doctor_id (FK to doctors.doctor_id)
- appointment_id (FK to appointments.appointment_id, nullable)
- diagnosis
- notes
- follow_up_required (boolean)
- follow_up_date (nullable)
- created_by_id (FK to users.user_id)
- created_by_type (DOCTOR, STAFF, ADMIN)
- created_at
- updated_at

---

## 9. Prescriptions Table

prescriptions
- prescription_id (PK)
- medical_record_id (FK to medical_records.record_id)
- doctor_id (FK to doctors.doctor_id)
- patient_id (FK to patients.patient_id)
- created_at
- updated_at

---

## 10. Prescription Items Table

prescription_items
- item_id (PK)
- prescription_id (FK to prescriptions.prescription_id)
- medication_id (FK to medications.medication_id)
- dosage
- frequency
- duration
- notes
- created_at
- updated_at

---

## 11. Medications Table

medications
- medication_id (PK)
- name
- description
- manufacturer
- dosage_form (tablet, capsule, etc.)
- strength
- created_at
- updated_at

---

## 12. Doctor Availability Table

doctor_availability
- availability_id (PK)
- doctor_id (FK to doctors.doctor_id)
- day_of_week
- start_time
- end_time
- is_available
- created_at
- updated_at

---

## 13. Payments Table

payments
- payment_id (PK)
- appointment_id (FK to appointments.appointment_id)
- patient_id (FK to patients.patient_id)
- amount
- payment_date
- payment_method
- transaction_id
- status (PENDING, COMPLETED, FAILED, REFUNDED)
- processed_by_id (FK to users.user_id)
- processed_by_type (STAFF, ADMIN)
- created_at
- updated_at

---

## 14. Reviews Table

reviews
- review_id (PK)
- patient_id (FK to patients.patient_id)
- doctor_id (FK to doctors.doctor_id)
- appointment_id (FK to appointments.appointment_id)
- rating
- comment
- created_at
- updated_at

---

## 15. Notifications Table

notifications
- notification_id (PK)
- recipient_type (DOCTOR, PATIENT, STAFF, ADMIN)
- recipient_id (FK to users.user_id)
- sender_type (DOCTOR, PATIENT, STAFF, ADMIN, SYSTEM)
- sender_id (FK to users.user_id, nullable if SYSTEM)
- title
- message
- is_read (boolean)
- type (APPOINTMENT, PRESCRIPTION, SYSTEM, etc.)
- related_entity_type (nullable)
- related_entity_id (nullable)
- created_at

---

## 16. Medical Tests Table

medical_tests
- test_id (PK)
- name
- description
- normal_range
- unit
- created_at
- updated_at

---

## 17. Patient Test Results Table

patient_test_results
- result_id (PK)
- patient_id (FK to patients.patient_id)
- test_id (FK to medical_tests.test_id)
- medical_record_id (FK to medical_records.record_id)
- result_value
- result_date
- doctor_id (FK to doctors.doctor_id)
- lab_technician_id (FK to staff.staff_id, nullable)
- notes
- created_at
- updated_at

---

## 18. Permissions Table

permissions
- permission_id (PK)
- name
- description
- created_at
- updated_at

---

## 19. Role Permissions Table

role_permissions
- id (PK)
- role_type (ADMIN, STAFF)
- role_id (FK to users.user_id)
- permission_id (FK to permissions.permission_id)
- created_at
- updated_at

---

## 20. Login History Table

login_history
- id (PK)
- user_id (FK to users.user_id)
- user_type (DOCTOR, PATIENT, STAFF, ADMIN)
- login_time
- logout_time (nullable)
- ip_address
- device_info

---

## 21. Audit Logs Table

audit_logs
- log_id (PK)
- user_id (FK to users.user_id)
- user_type (DOCTOR, PATIENT, STAFF, ADMIN)
- action
- entity_type
- entity_id
- old_values (JSON)
- new_values (JSON)
- timestamp
- ip_address

---

✅ Summary of Key Improvements:
- Centralized authentication through users table.
- Role-specific detail tables maintain logical separation and normalization.
- All FK references to users now use user_id.
- Polymorphic tracking and logging remain intact.
- Scalable for new user types in the future.