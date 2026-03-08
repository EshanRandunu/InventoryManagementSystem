package backend.controller;

import backend.exception.UserNotFoundException;
import backend.model.Role;
import backend.model.UserModel;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ================= REGISTER USER =================

    @PostMapping("/user")
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {

        // default role
        newUserModel.setRole(Role.ROLE_USER);

        // encrypt password
        newUserModel.setPassword(
                passwordEncoder.encode(newUserModel.getPassword())
        );

        return userRepository.save(newUserModel);
    }
    //====================== Admin Temp removed after test=============
//    @PostMapping("/admin")
//    public UserModel createAdmin(@RequestBody UserModel user){
//
//        user.setRole(Role.ROLE_ADMIN);
//
//        user.setPassword(
//                passwordEncoder.encode(user.getPassword())
//        );
//
//        return userRepository.save(user);
//    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserModel loginDetails) {

        UserModel user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not found: " + loginDetails.getEmail()));

        // password check
        if (passwordEncoder.matches(loginDetails.getPassword(), user.getPassword())) {

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Login Successful");
            response.put("id", user.getId());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } else {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credential"));
        }
    }

    // ================= GET ALL USERS =================

    @GetMapping("/users")
    List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= GET USER BY ID =================

    @GetMapping("/user/{id}")
    public UserModel getUserById(@PathVariable Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // ================= UPDATE USER =================

    @PutMapping("/user/{id}")
    public UserModel updateUser(@RequestBody UserModel newUserModel, @PathVariable Long id) {

        return userRepository.findById(id)
                .map(user -> {

                    user.setUserName(newUserModel.getUserName());
                    user.setEmail(newUserModel.getEmail());
                    user.setPhone(newUserModel.getPhone());

                    user.setPassword(
                            passwordEncoder.encode(newUserModel.getPassword())
                    );

                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("Could not find user with id " + id));
    }

    // ================= DELETE USER =================

    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {

        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        userRepository.delete(user);

        return "User deleted successfully";
    }

}