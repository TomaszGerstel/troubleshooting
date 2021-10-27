package com.tg.service;

import java.util.Comparator;

import com.tg.model.Problem;
import com.tg.model.ProblemNameToDisplay;


public class ProblemNamesComparator implements Comparator<ProblemNameToDisplay> {

	@Override
	public int compare (ProblemNameToDisplay p1, ProblemNameToDisplay p2) {
		 if (p1.getName() == null || p2.getName() == null) {
		      return 0;
		    }
		return p1.getName().compareToIgnoreCase(p2.getName());
	}


}

