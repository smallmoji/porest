package com.porest.web.model.user;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.porest.web.model.AuditModel;

@Entity
public class Friendship extends AuditModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(cascade = CascadeType.ALL)
	private UserProfile requester;
	
	@ManyToOne(cascade = CascadeType.ALL)
	private UserProfile friend;
	
	boolean active;
	
	public Friendship() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public UserProfile getRequester() {
		return requester;
	}

	public void setRequester(UserProfile requester) {
		this.requester = requester;
	}

	public UserProfile getFriend() {
		return friend;
	}

	public void setFriend(UserProfile friend) {
		this.friend = friend;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
	
	
}
