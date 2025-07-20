package com.cart.ecom_proj.controller.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String login;
    private String password;
}