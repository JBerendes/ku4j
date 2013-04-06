var tooltipStrategyRightJustify = function(tooltip, multiplier){
    tooltipStrategyRightJustify.base.call(this, tooltip, 1);
}
tooltipStrategyRightJustify.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(-this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
                
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
          
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(-this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
            
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .add($.coord(this.$offset, -this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
               
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, -this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
        
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
                
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, -this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
               
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .add($.coord(-this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
                         
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyRightJustify,
      abstractTooltipStrategy);