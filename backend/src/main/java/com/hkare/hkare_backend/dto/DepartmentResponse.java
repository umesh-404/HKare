package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private Long departmentId;
    private String name;
    private String description;
    private String headDoctorId;
    private String headDoctorName;
    
    public static DepartmentResponse fromDepartment(Department department) {
        return DepartmentResponse.builder()
                .departmentId(department.getDepartmentId())
                .name(department.getName())
                .description(department.getDescription())
                .headDoctorId(department.getHeadDoctor() != null ? department.getHeadDoctor().getDoctorId() : null)
                .headDoctorName(department.getHeadDoctor() != null ? 
                        "Dr. " + department.getHeadDoctor().getFirstName() + " " + department.getHeadDoctor().getLastName() : null)
                .build();
    }
} 