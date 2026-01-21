package com.saiguru.backend.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DefaultAdminSeeder implements CommandLineRunner {
    private final UserAccountRepository userAccountRepository;
    private final UserAccountService userAccountService;
    private final String defaultAdminPassword;

    public DefaultAdminSeeder(
        UserAccountRepository userAccountRepository,
        UserAccountService userAccountService,
        @Value("${DEFAULT_ADMIN_PASSWORD:Riddhesh9975}") String defaultAdminPassword
    ) {
        this.userAccountRepository = userAccountRepository;
        this.userAccountService = userAccountService;
        this.defaultAdminPassword = defaultAdminPassword;
    }

    @Override
    public void run(String... args) {
        if (userAccountRepository.existsByUsernameIgnoreCase("admin")) {
            return;
        }
        userAccountService.createUser("admin", defaultAdminPassword, UserRole.ADMIN);
    }
}
