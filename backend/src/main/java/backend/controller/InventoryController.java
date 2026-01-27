package backend.controller;

import java.io.File;
import java.nio.file.Paths;

import backend.exception.InventoryNotFoundException;
import backend.model.InventoryModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import backend.repository.InventoryRepository;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")

public class InventoryController {
    @Autowired
    private InventoryRepository inventoryRepository;

    @PostMapping("/inventory") //get data from model and save to DB
    public InventoryModel newInventoryModel(@RequestBody InventoryModel newInventoryModel) {
        return inventoryRepository.save(newInventoryModel); //get without img
    }

    @PostMapping("/inventory/itemImg")
    public String itemImage(@RequestParam("file") MultipartFile file) {
        String folder = "src/main/uploads/";//save folder path
        String itemImage = file.getOriginalFilename();

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            file.transferTo(Paths.get(folder + itemImage));

        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file " + itemImage;
        }
        return itemImage;
    }

    @GetMapping("/inventory")  // Add this to fetch all items
    public List<InventoryModel> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/inventory/{id}")
    InventoryModel getItemId(@PathVariable Long id) {
        return inventoryRepository.findById(id).orElseThrow(() -> new InventoryNotFoundException(id));
    }

    private final String UPLOAD_DIR = "src/main/uploads/";

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));

    }
    @PutMapping("/inventory/{id}")
    public InventoryModel updateItem(
            @RequestPart("itemDetails") InventoryModel newItem,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable long id
    ) {

        InventoryModel existingInventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException(id));

        // update normal fields
        existingInventory.setItemName(newItem.getItemName());
        existingInventory.setItemCategory(newItem.getItemCategory());
        existingInventory.setItemQty(newItem.getItemQty());
        existingInventory.setItemDetails(newItem.getItemDetails());

        // update image if provided
        if (file != null && !file.isEmpty()) {
            String imageName = file.getOriginalFilename();
            try {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                file.transferTo(Paths.get(UPLOAD_DIR + imageName));
                existingInventory.setItemImage(imageName);
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed");
            }
        }

        return inventoryRepository.save(existingInventory);
    }

    @DeleteMapping("/inventory/{id}")
    public String deleteItem(@PathVariable Long id) {

        InventoryModel item = inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException(id));

        inventoryRepository.delete(item);

        return "Item with id " + id + " deleted successfully";
    }





}
