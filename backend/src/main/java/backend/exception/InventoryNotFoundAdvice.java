package backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class InventoryNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(InventoryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> exceptionHandeler(InventoryNotFoundException exception) {
        Map<String,String>errorMap=new HashMap<>();
        errorMap.put("errorMassage",exception.getMessage());
        return errorMap;
    }
}
