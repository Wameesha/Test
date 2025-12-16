package com.jendo.app.domain.reportitemvalue.entity;

import com.jendo.app.domain.reportitem.entity.ReportItem;
import com.jendo.app.domain.reportattachment.entity.ReportAttachment;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "report_item_values")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"reportItem", "reportAttachments"})
@ToString(exclude = {"reportItem", "reportAttachments"})
public class ReportItemValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "value_number", precision = 10, scale = 2)
    private BigDecimal valueNumber;

    @Column(name = "value_text")
    private String valueText;

    @Column(name = "value_date")
    private LocalDate valueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_item_id", nullable = false)
    private ReportItem reportItem;

    @OneToMany(mappedBy = "reportItemValue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReportAttachment> reportAttachments = new ArrayList<>();
}
