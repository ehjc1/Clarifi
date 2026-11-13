from django.contrib import admin

from .models import Income, Line, Preferences, Rule, Statement


class LineInline(admin.TabularInline):
    model = Line
    extra = 0


@admin.register(Statement)
class StatementAdmin(admin.ModelAdmin):
    list_display = ["key", "owner", "label", "synthetic"]
    inlines = [LineInline]


admin.site.register([Rule, Income, Preferences])
