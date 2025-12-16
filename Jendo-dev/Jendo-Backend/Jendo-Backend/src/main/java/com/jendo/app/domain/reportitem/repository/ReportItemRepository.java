package com.jendo.app.domain.reportitem.repository;

import com.jendo.app.domain.reportitem.entity.ReportItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportItemRepository extends JpaRepository<ReportItem, Long> {
    
    List<ReportItem> findByJendoTestId(Long jendoTestId);
    
    List<ReportItem> findByReportSectionId(Long reportSectionId);
    
    Page<ReportItem> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
