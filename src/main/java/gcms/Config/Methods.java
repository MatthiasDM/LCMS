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
public enum Methods {
    GET(1), PUT(2), POST(3);
    private final int levelCode;

    Methods(int levelCode) {
        this.levelCode = levelCode;
    }

    public int getLevelCode() {
        return this.levelCode;
    }
}
