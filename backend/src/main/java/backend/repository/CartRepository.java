package backend.repository;

import backend.model.CartModel;
import backend.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartModel, Long> {
    
    List<CartModel> findByUser(UserModel user);
    
    Optional<CartModel> findByUserAndInventory(UserModel user, backend.model.InventoryModel inventory);
    
    void deleteByUser(UserModel user);
    
    boolean existsByUserAndInventory(UserModel user, backend.model.InventoryModel inventory);
}
