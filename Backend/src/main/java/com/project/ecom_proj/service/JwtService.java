package com.cart.ecom_proj.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Сервис для работы с JWT-токенами.
 * Генерирует, валидирует и извлекает данные из токенов.
 */
@Service
public class JwtService {

    /**
     * Секретный ключ для подписи JWT.
     */
    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Время жизни токена (в миллисекундах).
     */
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Извлечь имя пользователя из токена.
     * @param token JWT-токен
     * @return имя пользователя
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Извлечь произвольное поле из токена.
     * @param token JWT-токен
     * @param claimsResolver функция для извлечения поля
     * @return значение поля
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Сгенерировать JWT-токен для пользователя.
     * @param userDetails данные пользователя
     * @return JWT-токен
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        if (userDetails instanceof com.cart.ecom_proj.model.User user) {
            extraClaims.put("role", user.getRole());
        }
        return generateToken(extraClaims, userDetails);
    }

    /**
     * Сгенерировать JWT-токен с дополнительными полями.
     * @param extraClaims дополнительные поля
     * @param userDetails данные пользователя
     * @return JWT-токен
     */
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Проверить валидность токена.
     * @param token JWT-токен
     * @param userDetails данные пользователя
     * @return true, если токен валиден, иначе false
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}