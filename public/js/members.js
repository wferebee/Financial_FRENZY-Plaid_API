$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.name);
    $("#balance").text("loading balance");
    var token = data.token;
    $.post("/accounts/balance/get", { token: token }).then(function(res) {
      $("#balance").text("$" + res.toFixed(2));
    });
    $.post("/transaction/get", { token: token }).then(function(res) {
      var paychecks = [];
      for (i in res) {
        if (res[i].category) {
          if (
            res[i].category.indexOf("Payroll") != "-1" ||
            res[i].category.indexOf("Deposit") != "-1"
          ) {
            // console.log(res[i]);
            if (paychecks.indexOf(res[i].name.substring(0, 10)) == "-1") {
              paychecks.push(res[i].name.substring(0, 10));
            }
          }
        }
        if (res[i].amount < 0) {
          amount = "-$" + Math.abs(res[i].amount).toFixed(2);
        } else {
          amount = "$" + res[i].amount.toFixed(2);
        }
        var newTrans = $("<div>");
        newTrans.addClass("transact");
        newTrans.append(
          $("<div class=transName transID=" + i + ">" + res[i].name + "</div>")
        );
        newTrans.append(
          $("<div class=transDate transID=" + i + ">" + res[i].date + "</div>")
        );
        newTrans.append(
          $("<div class=transAmount transID=" + i + ">" + amount + "</div>")
        );
        $("#transactions").append(newTrans);
      }
      $(document).on("click", ".transName", function() {
        console.log(res[$(this).attr("transid")]);
        console.log($(this));
      });
      var whenPaid = [];
      for (i in paychecks) {
        console.log(paychecks);
        var paytimes = [];
        for (j in res) {
          if (res[j].name.substring(0, 10) == paychecks[i]) {
            console.log(res[j].name);
            paytimes.push(res[j]);
          }
        }
        if (paytimes.length > 1) {
          var day1 = moment(paytimes[0].date);
          var day2 = moment(paytimes[1].date);
          console.log(paytimes);
          console.log(day1.diff(day2, "days"));
          var time = day1.diff(day2, "days");
          console.log(day1.format("YYYY-MM-DD"));
          console.log(time);
          console.log(day1.add(14, "days").format("YYYY-MM-DD"));
          whenPaid.push({
            name: paychecks[i],
            nextPay: day1.format()
          });
        }
      }
      var shortestPayPeriod = 400;
      console.log(whenPaid);
      for (i in whenPaid) {
        if (moment(whenPaid[i].nextPay).diff(moment(), "days") < shortestPayPeriod&&moment(whenPaid[i].nextPay).diff(moment(), "days")>0) {
          console.log(i)
          shortestPayPeriod = moment(whenPaid[i].nextPay).diff(
            moment(),
            "days"
          );
        }
      }
      $("#nextPay").text(shortestPayPeriod + " days");
    });
  });
});
