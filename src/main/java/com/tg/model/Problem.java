package com.tg.model;

import java.io.File;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity(name = "problems")
public class Problem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String imageAddress;
    @Transient
    private File image;
    
 
    public Problem() {}    
     
    public Problem(String name, String description, String imageAddress) {
		super();
		this.name = name;
		this.description = description;
		this.imageAddress = imageAddress;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

	public String getImageAddress() {
		return imageAddress;
	}

	public void setImageAddress(String imageAddress) {
		this.imageAddress = imageAddress;
	}
	
	public File getImage() {
		return image;
	}

	public void setImage(File image) {
		this.image = image;
	}

	@Override
	public String toString() {
		return "Problem [id=" + id + ", name=" + name + ", description=" + description + ", imageAddress="
				+ imageAddress + "]";
	}

}
