package com.mounti.security;

import com.mounti.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {
    private String id;
    private String email;
    private String password;
    private String name;
    private Boolean isTransporter;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(String id, String email, String password, String name, 
                        Boolean isTransporter, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.isTransporter = isTransporter;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority(user.getIsTransporter() ? "ROLE_TRANSPORTER" : "ROLE_CLIENT")
        );

        return new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPassword(),
            user.getName(),
            user.getIsTransporter(),
            authorities
        );
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Boolean getIsTransporter() {
        return isTransporter;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}