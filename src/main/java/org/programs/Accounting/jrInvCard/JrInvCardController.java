package org.kaznalnrprograms.Accounting.jrInvCard;


import org.kaznalnrprograms.Accounting.jrInvCard.Models.jrInvCardModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;


@Controller
public class JrInvCardController {
    private IjrInvCardDao djrInvCard;

    public JrInvCardController(IjrInvCardDao djrInvCard)
    {
        this.djrInvCard = djrInvCard;
    }

    @GetMapping("/jrInvCard/jrInvCard")
    @PreAuthorize("GetActRight('jrInvCard','jrInvCardView')")
    public String jrInvCard(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrInvCard/jrInvCard :: jrInvCard";
    }

    /**
     * Получить обьект по id
     * @param id - id обьект
     * @return - обьект с данными обьекта
     * @throws Exception
     */
    @GetMapping("/jrInvCard/getObj")
    @PreAuthorize("GetActRight('jrInvCard','jrInvCardView')")
    public @ResponseBody  jrInvCardModel getObj(int id) throws Exception {
        return djrInvCard.getObj(id);
    }
}



