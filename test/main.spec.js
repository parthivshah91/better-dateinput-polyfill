describe("better-dateinput-polyfill", function() {
    function formatDateISO(value) {
        return value.toISOString().split("T")[0];
    }

    var el, calendar, months, label;

    beforeEach(function() {
        el = DOM.mock("<input type='date'>");
        calendar = DOM.mock();
        months = DOM.mock();
        label = DOM.mock("<span>");
    });

    it("should toggle calendar visibility on space key", function() {
        spyOn(el, "get").and.returnValue("");

        var toggleSpy = spyOn(calendar, "toggle");

        el._keydownCalendar(calendar, months, 32);
        expect(toggleSpy).toHaveBeenCalled();
    });

    it("should hide calendar on escape key", function() {
        var spy = spyOn(calendar, "hide");

        el._keydownCalendar(calendar, months, 27);
        expect(spy).toHaveBeenCalled();
    });

    it("should prevent default action on any key except tab", function() {
        expect(el._keydownCalendar(calendar, months, 9)).not.toBe(false);
        expect(el._keydownCalendar(calendar, months, 111)).toBe(false);

        var spy = spyOn(calendar, "matches").and.returnValue(true);

        expect(el._keydownCalendar(calendar, months, 13)).toBe(true);
        expect(spy).toHaveBeenCalledWith(":hidden");
    });

    it("should reset calendar value on backspace or delete keys", function() {
        var spy = spyOn(el, "value");

        el._keydownCalendar(calendar, months, 8);
        expect(spy).toHaveBeenCalledWith("");
        el._keydownCalendar(calendar, months, 46);
        expect(spy.calls.count()).toBe(2);
    });

    it("should handle arrow keys with optional shiftKey", function() {
        function expectKey(key, altKey, expected) {
            el._keydownCalendar(calendar, months, key);
            expect(el.value()).toBe(expected);
            el.value("2000-01-01");
        }

        el.value("2000-01-01");

        expectKey(74, false, "2000-01-08");
        expectKey(40, false, "2000-01-08");
        expectKey(75, false, "1999-12-25");
        expectKey(38, false, "1999-12-25");
        expectKey(76, false, "2000-01-02");
        expectKey(39, false, "2000-01-02");
        expectKey(72, false, "1999-12-31");
        expectKey(37, false, "1999-12-31");

        // cases with shift key
        // expectKey(39, true, "2000-02-01");
        // expectKey(37, true, "1999-12-01");
        // expectKey(40, true, "2001-01-01");
        // expectKey(38, true, "1999-01-01");
    });

    it("should change month on nav buttons click", function() {
        var months = DOM.mock("<table>");
        var target = DOM.mock("<a>");

        el.value("2000-01-01");
        el._clickCalendar(calendar, months, target);
        expect(el.value()).toBe("2000-02-01");

        spyOn(target, "next").and.returnValue(el);
        el._clickCalendar(calendar, months, target);
        expect(el.value()).toBe("2000-01-01");
    });

    // it("should select appropriate day on calendar click", function() {
    //     var now = new Date(2011, 6, 13, 12),
    //         target = DOM.mock("<td>").data("ts", now.getTime()),
    //         setSpy = spyOn(el, "value");

    //     el._clickCalendar(calendar, target);
    //     expect(setSpy).toHaveBeenCalledWith("2011-07-13");
    // });

    it("should hide calendar on blur", function() {
        var hideSpy = spyOn(calendar, "hide");

        el._blurCalendar(calendar);
        expect(hideSpy).toHaveBeenCalled();
    });

    it("should use current date for calendar if value is empty", function() {
        var now = new Date(),
            getSpy = spyOn(el, "get").and.returnValue(""),
            setSpy = spyOn(el, "value"),
            months = DOM.mock("<table>"),
            target = DOM.mock("<a>");

        now.setMonth(now.getMonth() + 1);

        el._clickCalendar(calendar, months, target);
        expect(getSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith(formatDateISO(now));

        spyOn(target, "next").and.returnValue(el);

        now.setMonth(now.getMonth() - 2);

        el._clickCalendar(calendar, months, target);
        expect(getSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith(formatDateISO(now));
    });

    it("should display calendar on focus", function() {
        var spy = spyOn(calendar, "show");

        el._focusCalendar(calendar);
        expect(spy).toHaveBeenCalled();
    });

    it("should restore initial value on form reset", function() {
        el.set("defaultValue", "2000-10-20");
        el.value("2000-10-2");

        el._resetForm();

        expect(el.value()).toBe("2000-10-20");
    });
});
