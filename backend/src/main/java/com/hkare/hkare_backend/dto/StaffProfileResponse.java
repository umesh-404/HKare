package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Department;
import com.hkare.hkare_backend.model.Staff;
import com.hkare.hkare_backend.model.Users.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffProfileResponse {
    private String staffId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private LocalDateTime dateOfBirth;
    private Gender gender;
    private Long departmentId;
    private String departmentName;
    private DepartmentDTO department;
    private String position;
    private LocalDate hireDate;
    private boolean isAdmin;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentDTO {
        private Long departmentId;
        private String name;
    }
    
    public static StaffProfileResponse fromStaff(Staff staff) {
        Department department = staff.getDepartment();
        
        DepartmentDTO departmentDTO = null;
        if (department != null) {
            departmentDTO = DepartmentDTO.builder()
                    .departmentId(department.getDepartmentId())
                    .name(department.getName())
                    .build();
        }
        
        return StaffProfileResponse.builder()
                .staffId(staff.getStaffId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getUser().getEmail())
                .phoneNumber(staff.getUser().getPhoneNumber())
                .address(staff.getUser().getAddress())
                .dateOfBirth(staff.getUser().getDateOfBirth())
                .gender(staff.getUser().getGender())
                .departmentId(department != null ? department.getDepartmentId() : null)
                .departmentName(department != null ? department.getName() : null)
                .department(departmentDTO)
                .position(staff.getPosition())
                .hireDate(staff.getHireDate())
                .isAdmin(staff.getStaffId() != null && staff.getStaffId().startsWith("A"))
                .build();
    }
} 