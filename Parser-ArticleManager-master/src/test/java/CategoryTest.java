import org.junit.Test;

import static org.junit.Assert.*;

public class CategoryTest {

    String title = "A Photovoltaic Generation System Based on Wide\n" +
            "Voltage-Gain DC-DC Converter and Differential\n" +
            "Power Processors for DC Microgrids ";
    String text = "In this paper, a photovoltaic(PV) generation system based on front-stage differential\n" +
            "power processors(DPP) and BACK-stage centralized wide voltage-gain converter is proposed. The\n" +
            "resonant switched capacitor(ReSC) converter, which features high power density and high efficiency, is\n" +
            "employed as the differential power processor and aims at processing the differential power among\n" +
            "series-connected PV modules, avoiding the great power loss caused by power mismatch of PV modules.\n" +
            "The ReSC converter in PV system can operate in equalization mode or MPPT mode and both modes are\n" +
            "researched. The BACK-stage DC-DC converter is implemented as the dual- phase-shift controlled\n" +
            "full-bridge converter(DPS-FBC). It has high conversion efficiency and wide voltage gain, suitable for\n" +
            "PV generation applications. The current source control for grid-connected mode and the voltage source\n" +
            "control for islanding mode are developed for DPS-FBC. Therefore, for the whole system with front and\n" +
            "BACK stage converters, the dual-mode control strategy is proposed. When the system is connected to\n" +
            "the grid, DPS-FBC operates as the current source for global MPPT for PV modules while ReSC\n" +
            "converters operate in maximum power point tracking(MPPT) mode for local MPPT. When the system\n" +
            "operates in an island, DPS-FBC works as the voltage source for constant output voltage control and\n" +
            "ReSC converters work in equalization mode. The mode switch is based on the voltage of output DC bus.\n" +
            "Simulations and experiments verify the feasibility of the proposed PV generation system and the\n" +
            "effectiveness of the proposed control algorithm\n" +
            "Keywords: Photovoltaic system, resonant switched capacitor, dual phase-shift control, soft\n" +
            "switching. ";

    Category category;

    @Test
    public void categorytest(){
        category = new Category(title, text);

        System.out.println();
        System.out.println();

       assertEquals(category.getCategories().toString()+category.getSubCategories().toString(),"[Technology & Computing]"+"[null]");

    }

}