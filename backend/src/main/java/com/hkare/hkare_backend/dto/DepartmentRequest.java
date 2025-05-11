package com.hkare.hkare_backend.dto;

public class DepartmentRequest {
    private String name;
    private String description;
    private String headDoctorId;

    public DepartmentRequest() {}

    public DepartmentRequest(String name, String description, String headDoctorId) {
        this.name = name;
        this.description = description;
        this.headDoctorId = headDoctorId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getHeadDoctorId() {
        return headDoctorId;
    }
    public void setHeadDoctorId(String headDoctorId) {
        this.headDoctorId = headDoctorId;
    }
}