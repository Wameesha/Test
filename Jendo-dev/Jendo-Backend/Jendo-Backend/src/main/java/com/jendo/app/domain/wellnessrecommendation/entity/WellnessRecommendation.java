package com.jendo.app.domain.wellnessrecommendation.entity;

import com.jendo.app.domain.appointment.entity.Appointment;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wellness_recommendations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"appointment"})
@ToString(exclude = {"appointment"})
public class WellnessRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "risk_level", length = 50)
    private String riskLevel;

    @Column(name = "type", length = 50)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
}
