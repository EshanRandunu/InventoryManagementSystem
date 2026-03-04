package backend.controller;

import backend.exception.UserNotFoundException;
import backend.model.UserModel;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    //insert
    @PostMapping("/user") //get data from model and save to DB
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {
        return userRepository.save(newUserModel);
    }

    //User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login (@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not found: " + loginDetails.getEmail()));
        //check the pw is matches
        if (user.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login Successfull");
            response.put("id", user.getId());//return user id
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "invalid credential"));
        }

    }

    //display
    @GetMapping("/users")
    List<UserModel>getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    public UserModel getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    //====================== update user
    @PutMapping("/user/{id}")
    public UserModel updateUser(@RequestBody UserModel newUserModel, @PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    // Update the fields with data from the request body
                    user.setUserName(newUserModel.getUserName());
                    user.setEmail(newUserModel.getEmail());
                    user.setPhone(newUserModel.getPhone());
                    user.setPassword(newUserModel.getPassword());

                    // Save the updated user back to the database
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("Could not find user with id " + id));
    }

    //====================== Delete user =====================================================
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {

        // check if user exists
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        userRepository.delete(user);

        return "User deleted successfully";
    }




}
