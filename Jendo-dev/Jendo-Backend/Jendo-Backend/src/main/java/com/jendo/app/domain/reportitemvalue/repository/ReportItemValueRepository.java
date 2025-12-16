package com.jendo.app.domain.reportitemvalue.repository;

import com.jendo.app.domain.reportitemvalue.entity.ReportItemValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportItemValueRepository extends JpaRepository<ReportItemValue, Long> {
    
    List<ReportItemValue> findByReportItemId(Long reportItemId);
}
