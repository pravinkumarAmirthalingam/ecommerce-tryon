package com.pravin.ecommerce.controller;

import com.pravin.ecommerce.dto.AddToCartRequest;
import com.pravin.ecommerce.order.Cart;
import com.pravin.ecommerce.order.Order;
import com.pravin.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<Cart> viewCart() {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.ok(cartService.getCartForUser(email));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request) {
        String email = getAuthenticatedUserEmail();
        Cart updatedCart = cartService.addToCart(email, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long cartItemId) {
        String email = getAuthenticatedUserEmail();
        Cart updatedCart = cartService.removeFromCart(email, cartItemId);
        return ResponseEntity.ok(updatedCart);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout() {
        String email = getAuthenticatedUserEmail();
        Order order = cartService.checkout(email);
        return ResponseEntity.ok(order);
    }
}
