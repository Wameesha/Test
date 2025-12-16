package com.jendo.app.domain.doctor.service;

import com.jendo.app.common.dto.PaginationResponse;
import com.jendo.app.domain.doctor.dto.DoctorRequestDto;
import com.jendo.app.domain.doctor.dto.DoctorResponseDto;

import java.util.List;

public interface DoctorService {
    
    DoctorResponseDto createDoctor(DoctorRequestDto request);
    
    DoctorResponseDto getDoctorById(Long id);
    
    PaginationResponse<DoctorResponseDto> getAllDoctors(int page, int size);
    
    PaginationResponse<DoctorResponseDto> getDoctorsBySpecialty(String specialty, int page, int size);
    
    List<DoctorResponseDto> getAvailableDoctors();
    
    DoctorResponseDto updateDoctor(Long id, DoctorRequestDto request);
    
    void deleteDoctor(Long id);
}
