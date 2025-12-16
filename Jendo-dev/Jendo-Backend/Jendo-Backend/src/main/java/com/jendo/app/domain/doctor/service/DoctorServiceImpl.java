package com.jendo.app.domain.doctor.service;

import com.jendo.app.common.dto.PaginationResponse;
import com.jendo.app.common.exceptions.NotFoundException;
import com.jendo.app.domain.doctor.dto.DoctorRequestDto;
import com.jendo.app.domain.doctor.dto.DoctorResponseDto;
import com.jendo.app.domain.doctor.entity.Doctor;
import com.jendo.app.domain.doctor.mapper.DoctorMapper;
import com.jendo.app.domain.doctor.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorServiceImpl.class);
    
    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    @Override
    public DoctorResponseDto createDoctor(DoctorRequestDto request) {
        logger.info("Creating new doctor: {}", request.getName());
        
        Doctor doctor = doctorMapper.toEntity(request);
        doctor = doctorRepository.save(doctor);
        
        logger.info("Doctor created successfully with ID: {}", doctor.getId());
        return doctorMapper.toResponseDto(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorResponseDto getDoctorById(Long id) {
        logger.info("Fetching doctor with ID: {}", id);
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Doctor", id));
        return doctorMapper.toResponseDto(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<DoctorResponseDto> getAllDoctors(int page, int size) {
        logger.info("Fetching all doctors - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Doctor> doctorPage = doctorRepository.findAll(pageable);
        return buildPaginationResponse(doctorPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<DoctorResponseDto> getDoctorsBySpecialty(String specialty, int page, int size) {
        logger.info("Fetching doctors by specialty: {} - page: {}, size: {}", specialty, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Doctor> doctorPage = doctorRepository.findBySpecialtyContainingIgnoreCase(specialty, pageable);
        return buildPaginationResponse(doctorPage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDto> getAvailableDoctors() {
        logger.info("Fetching all available doctors");
        List<Doctor> doctors = doctorRepository.findByIsAvailableTrue();
        return doctors.stream().map(doctorMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public DoctorResponseDto updateDoctor(Long id, DoctorRequestDto request) {
        logger.info("Updating doctor with ID: {}", id);
        
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Doctor", id));
        
        if (request.getName() != null) doctor.setName(request.getName());
        if (request.getSpecialty() != null) doctor.setSpecialty(request.getSpecialty());
        if (request.getHospital() != null) doctor.setHospital(request.getHospital());
        if (request.getEmail() != null) doctor.setEmail(request.getEmail());
        if (request.getPhone() != null) doctor.setPhone(request.getPhone());
        if (request.getQualifications() != null) doctor.setQualifications(request.getQualifications());
        if (request.getImageUrl() != null) doctor.setImageUrl(request.getImageUrl());
        if (request.getAddress() != null) doctor.setAddress(request.getAddress());
        if (request.getIsAvailable() != null) doctor.setIsAvailable(request.getIsAvailable());
        if (request.getAvailableDays() != null) doctor.setAvailableDays(request.getAvailableDays());
        
        doctor = doctorRepository.save(doctor);
        logger.info("Doctor updated successfully with ID: {}", id);
        return doctorMapper.toResponseDto(doctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        logger.info("Deleting doctor with ID: {}", id);
        
        if (!doctorRepository.existsById(id)) {
            throw new NotFoundException("Doctor", id);
        }
        
        doctorRepository.deleteById(id);
        logger.info("Doctor deleted successfully with ID: {}", id);
    }
    
    private PaginationResponse<DoctorResponseDto> buildPaginationResponse(Page<Doctor> doctorPage) {
        List<DoctorResponseDto> content = doctorPage.getContent().stream()
                .map(doctorMapper::toResponseDto)
                .collect(Collectors.toList());
        
        return PaginationResponse.<DoctorResponseDto>builder()
                .content(content)
                .pageNumber(doctorPage.getNumber())
                .pageSize(doctorPage.getSize())
                .totalElements(doctorPage.getTotalElements())
                .totalPages(doctorPage.getTotalPages())
                .first(doctorPage.isFirst())
                .last(doctorPage.isLast())
                .build();
    }
}
