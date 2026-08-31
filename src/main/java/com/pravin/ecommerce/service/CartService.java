package com.pravin.ecommerce.service;

import com.pravin.ecommerce.order.*;
import com.pravin.ecommerce.product.Shirt;
import com.pravin.ecommerce.product.ShirtRepository;
import com.pravin.ecommerce.user.User;
import com.pravin.ecommerce.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final ShirtRepository shirtRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       OrderRepository orderRepository,
                       ShirtRepository shirtRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.shirtRepository = shirtRepository;
        this.userRepository = userRepository;
    }

    public Cart getCartForUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public Cart addToCart(String email, Long productId, int quantity) {
        Cart cart = getCartForUser(email);
        Shirt product = shirtRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(String email, Long cartItemId) {
        Cart cart = getCartForUser(email);
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        return cartRepository.save(cart);
    }

    @Transactional
    public Order checkout(String email) {
        Cart cart = getCartForUser(email);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        double totalAmount = 0;

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
            
            totalAmount += (cartItem.getProduct().getPrice() * cartItem.getQuantity());
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }
}
