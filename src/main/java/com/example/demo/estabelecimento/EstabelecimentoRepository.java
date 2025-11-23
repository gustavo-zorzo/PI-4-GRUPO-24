package com.example.demo.estabelecimento;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EstabelecimentoRepository extends MongoRepository<Estabelecimento, String> {
    List<Estabelecimento> findByOwnerId(String ownerId);
    List<Estabelecimento> findByOwnerEmailIgnoreCase(String ownerEmail);
}
