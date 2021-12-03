package com.tg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tg.model.TroubleComments;

@Repository
public interface TroubleCommentsRepository extends JpaRepository<TroubleComments, Long> {

	
}