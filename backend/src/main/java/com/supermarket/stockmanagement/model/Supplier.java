package com.supermarket.stockmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "suppliers")
public class Supplier {
    @Id
    private String id;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
}
