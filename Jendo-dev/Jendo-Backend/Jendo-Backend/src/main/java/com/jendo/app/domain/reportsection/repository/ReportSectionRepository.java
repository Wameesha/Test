package com.jendo.app.domain.reportsection.repository;

import com.jendo.app.domain.reportsection.entity.ReportSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportSectionRepository extends JpaRepository<ReportSection, Long> {
    
    Optional<ReportSection> findByName(String name);
}
