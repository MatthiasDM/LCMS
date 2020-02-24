/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.credentials;

import at.favre.lib.crypto.bcrypt.BCrypt;
import java.nio.charset.StandardCharsets;
import java.util.function.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Matthias
 */
public class Cryptography {

    private static final Logger log = LoggerFactory.getLogger(Cryptography.class);
    private final int logRounds;
    public Cryptography(int logRounds) {
        this.logRounds = logRounds;
    }

    public static String hash(String password) {
        char[] bcryptChars = BCrypt.withDefaults().hashToChar(12, password.toCharArray());
        return String.valueOf(bcryptChars);
    }

    public static boolean verifyHash(String password, String hash) {
        return BCrypt.verifyer().verify(password.toCharArray(), hash.toCharArray()).verified;
    }

    public boolean verifyAndUpdateHash(String password, String hash, Function<String, Boolean> updateFunc) {
        if (BCrypt.verifyer().verify(password.toCharArray(), hash.toCharArray()).verified) {
            int rounds = getRounds(hash);
            // It might be smart to only allow increasing the rounds.
            // If someone makes a mistake the ability to undo it would be nice though.
            if (rounds != logRounds) {
                log.debug("Updating password from {} rounds to {}", rounds, logRounds);
                String newHash = hash(password);
                return updateFunc.apply(newHash);
            }
            return true;
        }
        return false;
    }

    /*
     * Copy pasted from BCrypt internals :(. Ideally a method
     * to exports parts would be public. We only care about rounds
     * currently.
     */
    private int getRounds(String salt) {
        char minor = (char) 0;
        int off = 0;

        if (salt.charAt(0) != '$' || salt.charAt(1) != '2') {
            throw new IllegalArgumentException("Invalid salt version");
        }
        if (salt.charAt(2) == '$') {
            off = 3;
        } else {
            minor = salt.charAt(2);
            if (minor != 'a' || salt.charAt(3) != '$') {
                throw new IllegalArgumentException("Invalid salt revision");
            }
            off = 4;
        }

        // Extract number of rounds
        if (salt.charAt(off + 2) > '$') {
            throw new IllegalArgumentException("Missing salt rounds");
        }
        return Integer.parseInt(salt.substring(off, off + 2));
    }
}
