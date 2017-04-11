package com.megapractical.metroquito.service;

import com.megapractical.metroquito.domain.*;
import com.megapractical.metroquito.domain.enumeration.GeneratorType;
import com.megapractical.metroquito.domain.report.PoaActivityReportModel;
import com.megapractical.metroquito.domain.report.PoaBudgetReportModel;
import com.megapractical.metroquito.domain.report.PoaProductReportModel;
import com.megapractical.metroquito.domain.report.PoaSubactivityReportModel;
import com.megapractical.metroquito.repository.ActivityPoaRepository;
import com.megapractical.metroquito.repository.spec.ActivityPoaSpecification;
import com.megapractical.metroquito.util.FilterMapGenerator;
import com.megapractical.metroquito.web.rest.dto.*;
import com.megapractical.metroquito.web.rest.mapper.ActivityPoaHeadingSubheadingMapper;
import com.megapractical.metroquito.web.rest.mapper.ActivityPoaMapper;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service Implementation for managing ActivityPoa.
 */
@Service
@Transactional
public class ActivityPoaService {

    private final Logger log = LoggerFactory.getLogger(ActivityPoaService.class);

    @Inject
    private ActivityPoaRepository activityPoaRepository;

    @Inject
    private ActivityPoaMapper activityPoaMapper;

    @Inject
    private IdentificationGeneratorService generatorService;

    @Inject
    private ActivityBudgetService activityBudgetService;

    @Inject
    private PoaAuditsService poaAuditsService;

    @Inject
    private ActivityPoaHeadingSubheadingService activityPoaHeadingSubheadingService;

    /**
     * Save a activityPoa.
     *
     * @param activityPoaDTO the entity to save
     * @return the persisted entity
     */
    public ActivityPoaDTO save(ActivityPoaDTO activityPoaDTO) {
        log.debug("Request to save ActivityPoa : {}", activityPoaDTO);

        Boolean flagNewActivity = false;
        String action = null;
        Boolean changeDate = activityPoaDTO.getChangeDates();

        Set<UserDTO> usersDTO = activityPoaDTO.getUsers();
        Set<User> users = new HashSet<>();

        usersDTO.forEach((userDTO) -> {
            User user = new User();
            user.setId(userDTO.getId());

            users.add(user);
        });

        Long administrativeUnitId = activityPoaDTO.getAdministrativeUnitId();
        Integer poaYear = activityPoaDTO.getPoaYear();

        ActivityPoa activityPoa = activityPoaMapper.activityPoaDTOToActivityPoa(activityPoaDTO);
        activityPoa.setUsers(users);

        if(activityPoa.getCode() == null){
            activityPoa.setCode(this.generateActivityCode(administrativeUnitId, poaYear));
            activityPoa.setCodeCompare(new Integer(activityPoa.getCode()));
        }

        if(activityPoa.isMultiannual() == null){
            activityPoa.setMultiannual(Boolean.FALSE);
        }

        if(activityPoa.isDrag() == null){
            activityPoa.setDrag(Boolean.FALSE);
        }

        if(activityPoa.getId() == null){
            flagNewActivity = true;
            activityPoa.setRegistrationDate(LocalDate.now());
        }

        activityPoa = activityPoaRepository.save(activityPoa);
		
        if(flagNewActivity){
            action = "Adicionando actividad ".concat(activityPoa.getCode());
        }else{
            action = "Modificando actividad ".concat(activityPoa.getCode());

            if(changeDate != null && changeDate){
                action = "Actualizando fecha de inicio o fecha de fin de la actividad ".concat(activityPoa.getCode());
            }
        }
        poaAuditsService.createPoaAudits(action);

        ActivityPoaDTO result = activityPoaMapper.activityPoaToActivityPoaDTO(activityPoa);

        return result;
    }
 
    /**
     * get an activityCode
     *
     * @return String
     */
    private String generateActivityCode(Long administrativeUnitId, Integer poaYear){
        GeneratorType type = GeneratorType.ACTIVITY_CODE;
        String prefix = "";
        String separator = "";
        String variableName = administrativeUnitId.toString();
        if(poaYear != null){
            variableName = variableName.concat("-").concat(poaYear.toString());
        }
        int length = 1;

        return generatorService.generateID(type, variableName, prefix, separator, length);
    }

    /**
     *  Get all the activityPoas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ActivityPoa> findAll(Pageable pageable) {
        log.debug("Request to get all ActivityPoas");
        Page<ActivityPoa> result = activityPoaRepository.findAll(pageable);
        return result;
    }

    /**
     *  Get all the activityPoas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ActivityPoaDTO> findByFilter(String description, LocalDateTime fromDate, LocalDateTime toDate, String responsible,
                                    String administrativeUnit, Long productId, Long adminUnitDirectionId, Pageable pageable) {
        log.debug("Request to get all ActivityPoas");

        FilterMapGenerator generator = new FilterMapGenerator();

        if(!StringUtils.isEmpty(administrativeUnit)){
            AdministrativeUnit adminUnit = new AdministrativeUnit();
            adminUnit.setId(new Long(administrativeUnit));

            generator.addEntityFilter("administrativeUnit", adminUnit);
        }

        if(!StringUtils.isEmpty(responsible)){
            generator.addResponsibleFilter(responsible);
        }

        if(!StringUtils.isEmpty(description)){
            generator.addCodeDescriptionFilter(description);
        }

        if(fromDate != null){
            generator.addBetweenFilter("startDate", Date.from(fromDate.toLocalDate().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        }

        if(toDate != null){
            generator.addBetweenFilter("finalDate", Date.from(toDate.toLocalDate().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        }

        if(productId != null){
            ProductAU product = new ProductAU();
            product.setId(productId);

            generator.addEntityFilter("product", product);
        }

        if(adminUnitDirectionId != null){
            AdminUnitDirection adminUnitDirection = new AdminUnitDirection();
            adminUnitDirection.setId(adminUnitDirectionId);

            generator.addEntityFilter("adminUnitDirection", adminUnitDirection);
        }

        Map<String, Object> map = generator.getMap();
        ActivityPoaSpecification spec = new ActivityPoaSpecification();

        Page<ActivityPoaDTO> activityPoaDTOsTemp = activityPoaRepository.findAll(spec.filter(map), pageable).map(this::fillActivityDTO);
 
        Page<ActivityPoaDTO> result = new PageImpl<ActivityPoaDTO>(activityPoaDTOsTempContent, pageable, activityPoaDTOsTemp.getTotalElements());

        return result;
    }

    /**
     *
     * @param activityBudgetId
     * @return
     */
    @Transactional(readOnly = true)
    public ActivityPoaDTO getActivityByBudget(Long activityBudgetId) {
        log.debug("Request to get all ActivityPoas");

        FilterMapGenerator generator = new FilterMapGenerator();

        if(activityBudgetId != null){
            ActivityBudget activityBudget = new ActivityBudget();
            activityBudget.setId(activityBudgetId);

            generator.addEntityFilter("activityBudget", activityBudget);
        }

        Map<String, Object> map = generator.getMap();
        ActivityPoaSpecification spec = new ActivityPoaSpecification();

        ActivityPoa result = activityPoaRepository.findOne(spec.filter(map));

        return activityPoaMapper.activityPoaToActivityPoaDTO(result);
    }

    private ActivityPoaDTO fillActivityDTO(ActivityPoa activityPoa){
        Integer count = activityPoa.getSubactivities().size();
        ActivityPoaDTO dto = activityPoaMapper.activityPoaToActivityPoaDTO(activityPoa);
        dto.setSubactivitiesAmount(count);
        return dto;
    }

    /**
     *  Get one activityPoa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public ActivityPoaDTO findOne(Long id) {
        log.debug("Request to get ActivityPoa : {}", id);
        ActivityPoa activityPoa = activityPoaRepository.findOneWithEagerRelationships(id);
        ActivityPoaDTO activityPoaDTO = activityPoaMapper.activityPoaToActivityPoaDTO(activityPoa);
        return activityPoaDTO;
    }

    /**
     *  Get one List activityPoaHeadingSubheadingDTO by activityPoaId.
     *
     *  @param activityPoaId the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public List<ActivityPoaHeadingSubheadingDTO> findbyActivityPoaId(Long activityPoaId) {
        log.debug("Request to get ActivityPoaHeadingSubheading : {}", activityPoaId);

        List<ActivityPoaHeadingSubheadingDTO> activityPoaHeadingSubheadingDTOs = activityPoaHeadingSubheadingService.findbyActivityPoaId(activityPoaId);

        return activityPoaHeadingSubheadingDTOs;
    }

    /**
     *  Delete the  activityPoa by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete ActivityPoa : {}", id);

        ActivityPoaDTO activityPoa = this.findOne(id);
        activityPoaRepository.delete(id);

        String action = "Eliminando actividad ".concat(activityPoa.getCode());
        poaAuditsService.createPoaAudits(action);

        this.decreaseActivityCode(activityPoa);
    }

    private void decreaseActivityCode(ActivityPoaDTO activityPoa){
        GeneratorType type = GeneratorType.ACTIVITY_CODE;
        String prefix = "";
        String separator = "";
        String variableName = activityPoa.getAdministrativeUnitId().toString();
        if(activityPoa.getPoaYear() != null){
            variableName = variableName.concat("-").concat(activityPoa.getPoaYear().toString());
        }
        Long comparator = new Long(activityPoa.getCode());

        generatorService.decreaseID(type, variableName, comparator);
    }
}