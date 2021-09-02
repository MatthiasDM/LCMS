/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.Config;

/**
 *
 * @author Matthias
 */
public enum Roles {
    ADMIN(100), USER(2), GUEST(1);
    private final int levelCode;

    Roles(int levelCode) {
        this.levelCode = levelCode;
    }

    public int getLevelCode() {
        return this.levelCode;
    }
}
